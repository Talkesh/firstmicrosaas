# Deployment Guide

This guide will help you deploy the AI Video Generation Platform to Vercel.

## Prerequisites

1. GitHub account
2. Vercel account (sign up at [vercel.com](https://vercel.com))
3. All service accounts set up:
   - Clerk (for authentication)
   - Stripe (for payments)
   - AWS S3 (for file storage)
   - PostgreSQL database (for production)

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Don't initialize it with README, .gitignore, or license
3. Copy the repository URL

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/Talkesh/firstmicrosaas.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### 2.1 Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 2.2 Configure Build Settings

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 2.3 Add Environment Variables

Add all the following environment variables in Vercel:

#### Database
```
DATABASE_URL=postgresql://postgres:your_password@db.tuehnsicbdkebbyxdsah.supabase.co:5432/postgres?sslmode=require
```

#### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
```

#### Stripe
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### App URL
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### AWS S3
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=eu-north-1
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_USE_PRESIGNED_URLS=false
```

### 2.4 Deploy

Click "Deploy" and wait for the build to complete.

## Step 3: Configure Webhooks

### 3.1 Clerk Webhooks

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/clerk`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the signing secret to `CLERK_WEBHOOK_SECRET`

### 3.2 Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Subscribe to events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_failed`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

## Step 4: Database Setup

### 4.1 Production Database

Set up a PostgreSQL database (recommended providers):
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)

### 4.2 Run Migrations

After setting up the database:

```bash
# Set production DATABASE_URL
export DATABASE_URL="your_production_database_url"

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate
```

Or use Vercel's CLI:

```bash
vercel env pull .env.production
npm run db:migrate
```

## Step 5: Verify Deployment

1. Visit your deployed app: `https://your-app.vercel.app`
2. Test authentication (sign up/login)
3. Test file upload
4. Test payment flow (use Stripe test mode first)
5. Check webhook logs in Clerk and Stripe dashboards

## Troubleshooting

### Build Errors

- Check that all environment variables are set
- Verify Prisma Client is generated: `npm run db:generate`
- Check build logs in Vercel dashboard

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- Ensure SSL is enabled (add `?sslmode=require`)

### Webhook Issues

- Verify webhook URLs are correct
- Check webhook secrets match
- Review webhook logs in service dashboards

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Clerk webhooks configured
- [ ] Stripe webhooks configured
- [ ] Test authentication flow
- [ ] Test file upload
- [ ] Test payment flow
- [ ] Monitor error logs

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

