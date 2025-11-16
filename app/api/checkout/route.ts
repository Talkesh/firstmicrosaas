import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/user'
import { stripe, calculateCreditPrice, getCreditOption } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await req.json()
    const { credits } = body

    // Validate credits
    if (!credits || typeof credits !== 'number' || credits < 1) {
      return NextResponse.json(
        { error: 'Invalid credit amount' },
        { status: 400 }
      )
    }

    // Calculate price
    const price = calculateCreditPrice(credits)
    const priceInCents = Math.round(price * 100) // Convert to cents

    // Get credit option for display
    const creditOption = getCreditOption(credits)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credits} Credit${credits > 1 ? 's' : ''}`,
              description: creditOption?.discount
                ? `${creditOption.discount}% discount applied`
                : undefined,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/credits?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/credits?canceled=true`,
      client_reference_id: user.clerkUserId,
      metadata: {
        userId: user.clerkUserId,
        credits: credits.toString(),
        amount: priceInCents.toString(),
      },
    })

    // Create transaction record
    await db.transaction.create({
      data: {
        userId: user.clerkUserId,
        amount: priceInCents,
        type: 'credit_purchase',
        status: 'pending',
        stripeSessionId: session.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}


