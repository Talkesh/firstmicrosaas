import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Get metadata
      const userId = session.metadata?.userId
      const credits = session.metadata?.credits
      const amount = session.metadata?.amount

      if (!userId || !credits || !amount) {
        console.error('Missing metadata in checkout session:', session.id)
        return NextResponse.json(
          { error: 'Missing required metadata' },
          { status: 400 }
        )
      }

      // Find the transaction by stripeSessionId
      const transaction = await db.transaction.findUnique({
        where: {
          stripeSessionId: session.id,
        },
      })

      if (!transaction) {
        console.error('Transaction not found for session:', session.id)
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        )
      }

      // Update transaction status
      await db.transaction.update({
        where: {
          id: transaction.id,
        },
        data: {
          status: 'completed',
        },
      })

      // Update user credit balance
      const creditsToAdd = parseInt(credits, 10)
      await db.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          creditBalance: {
            increment: creditsToAdd,
          },
        },
      })

      console.log(
        `Payment successful: User ${userId} purchased ${creditsToAdd} credits`
      )
    } catch (error) {
      console.error('Error processing checkout.session.completed:', error)
      return NextResponse.json(
        { error: 'Error processing webhook' },
        { status: 500 }
      )
    }
  } else if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Update transaction status to failed
      const transaction = await db.transaction.findUnique({
        where: {
          stripeSessionId: session.id,
        },
      })

      if (transaction) {
        await db.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: 'failed',
          },
        })
      }

      console.log(`Payment failed for session: ${session.id}`)
    } catch (error) {
      console.error('Error processing payment failure:', error)
    }
  }

  return NextResponse.json({ received: true })
}


