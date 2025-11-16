## Your goal is to create a Next.js application using modern technologies to build a reliable and scalable platform for creating AI generated videos from images and prompts.

# Technologies Used:

- Next.js 14 as the framework
- TypeScript for type safety
- Tailwind CSS for styling
- Clerk for authentication
- Prisma as ORM for database
- Stripe for payments
- AWS S3 for image storage
- LumaAI for AI functionality
- Svix for webhooks

# Core Functionality

## 1. Database

- Prisma schemas
- Migrations
- Table relationships
- Transactions
- Tables for users, transactions, generations

## 2. Authentication

- Full Clerk integration
- Webhooks for user.created, user.deleted, user.updated
- Prisma integration for user data storage
- With fields:

  id Int @id @default(autoincrement())
  clerkUserId String @unique
  email String
  name String
  creditBalance Int @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
- clerkUserId is the primary identifier for all relationships

## 3. Payment System

- Stripe Checkout integration
- Do not use {auth}, use currentUser()
- Webhook handling
- Transaction history with fields:

  id              Int         @id @default(autoincrement())
  userId          String
  amount          Int
  type            String
  status          String
  generationId    Int?
  stripeSessionId String?     @unique
  createdAt       DateTime    @default(now())
- Ability to choose credit amount for purchase
- 1 credit = 1 generation / 1 credit = 1 dollar
- Bulk credit purchases are discounted. Example: 20 credits - $18

## 4. File Management

- AWS S3 integration
- File type validation
- File size limitations
- Preview generation
- Upload status tracking
- Upload photo - get photo link

## 5. AI Functionality

- LumaAI integration
- Provide photo and prompts - receive result link
- Option to enable/disable loop
- Send callback_url to webhook for generation result updates

## 6. Deploy

- Create GitHub repository and push the project
- Deploy to Vercel
- Add environment variables

# Pages

## Home Page

- Bottom toolbar for photo upload and prompt input, with loop mode option
- Slider with latest generations

## Library

- My generations

## Credits Purchase Page

- Credit balance and slider for purchasing
- Used credits

# Documentation

## 1. Clerk Documentation

import { clerkMiddleware } from '@clerk/nextjs/server'
export default clerkMiddleware()
export const config = {
  matcher: [
    '/((?!_next|[^?]_\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest))._)',
    '/(api|trpc)(.*)',
  ],
}
## 2. Stripe Integration

- Example of creating payment session:

import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)
# Important Implementation Notes

## 0. Logging

- Adding server-side logging for error tracking

## 1. Project Setup

- Components in /components
- Pages in /app
- Using Next.js 14 app router
- Server components for data fetching
- Client components with 'use client'

## 2. Server API Calls

- All external API calls through server routes
- Creating API routes in app/api
- Client components work through these APIs
- Request validation

## 3. Environment Variables

- Storing sensitive information in environment variables
- Using .env for development
- Configuring variables on deployment platform
- Access only in server code

## 4. Error Handling

- Comprehensive handling on client and server
- Server logging
- Clear user messages
- Operation status tracking

## 5. Type Safety

- TypeScript interfaces for all data structures
- Avoiding any type
- Precise variable type definitions
- Input data validation

## 6. API Client Initialization

- Initialization only in server code
- Initialization validation
- Connection error handling
- Connection reuse

## 7. Data Fetching in Components

- Using React hooks
- Loading state management
- Error handling