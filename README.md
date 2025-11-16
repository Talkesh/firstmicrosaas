# AI Video Generation Platform

A Next.js application for creating AI-generated videos from images and prompts using modern technologies.

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Clerk** - Authentication
- **Prisma** - Database ORM
- **Stripe** - Payment processing
- **AWS S3** - File storage
- **PostgreSQL** - Database

## Features

- ✅ User authentication with Clerk
- ✅ Credit-based payment system with Stripe
- ✅ File upload to AWS S3
- ✅ Transaction history
- ✅ User management
- ✅ Webhook integrations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Accounts for: Clerk, Stripe, AWS

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ms-practice-1
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ms_practice_1?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_USE_PRESIGNED_URLS=false
```

4. Set up the database:
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:push` - Push schema changes to database

## Project Structure

```
ms-practice-1/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── checkout/      # Stripe checkout
│   │   ├── upload/        # File upload
│   │   └── webhooks/      # Webhook handlers
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Utility functions
│   ├── db.ts             # Prisma client
│   ├── user.ts           # User utilities
│   ├── stripe.ts         # Stripe client
│   ├── s3.ts             # AWS S3 client
│   └── upload.ts         # Upload utilities
├── prisma/                # Prisma schema
│   └── schema.prisma     # Database schema
└── public/               # Static files
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables
4. Deploy!

## Environment Variables

All required environment variables are listed in the installation section above. Make sure to set them in your deployment platform (Vercel, etc.) as well.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)

## License

This project is private and proprietary.
