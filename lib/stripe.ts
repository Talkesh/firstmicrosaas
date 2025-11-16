import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Client-side Stripe instance
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// Credit pricing configuration
// 1 credit = $1, with bulk discounts
export interface CreditOption {
  credits: number
  price: number // in dollars
  discount?: number // percentage discount
}

export const CREDIT_OPTIONS: CreditOption[] = [
  { credits: 1, price: 1 },
  { credits: 5, price: 4.5, discount: 10 }, // 10% off
  { credits: 10, price: 9, discount: 10 }, // 10% off
  { credits: 20, price: 18, discount: 10 }, // 10% off (as per example)
  { credits: 50, price: 40, discount: 20 }, // 20% off
  { credits: 100, price: 75, discount: 25 }, // 25% off
]

/**
 * Get credit option by number of credits
 */
export function getCreditOption(credits: number): CreditOption | undefined {
  return CREDIT_OPTIONS.find((option) => option.credits === credits)
}

/**
 * Calculate price for a given number of credits
 */
export function calculateCreditPrice(credits: number): number {
  const option = getCreditOption(credits)
  if (option) {
    return option.price
  }
  // If no specific option, calculate base price
  return credits
}


