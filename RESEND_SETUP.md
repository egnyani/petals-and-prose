# Resend + Vercel Setup – 3,000 emails/month free

Send letters directly from the website with no per-user limits on the free tier.

## 1. Resend account

1. Sign up at [resend.com](https://resend.com)
2. Go to [API Keys](https://resend.com/api-keys) → Create API Key
3. Copy the key (starts with `re_`)

**Note:** For testing, Resend provides `onboarding@resend.dev` as the sender. For production, [verify your domain](https://resend.com/domains) and set `FROM_EMAIL` in Vercel.

## 2. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Vercel will detect the project. Deploy.

## 3. Add environment variable

1. In Vercel: Project → Settings → Environment Variables
2. Add:
   - **Name:** `RESEND_API_KEY`
   - **Value:** your Resend API key
3. Redeploy the project (Deployments → ⋮ → Redeploy)

## 4. Optional: custom sender (production)

For production, verify your domain in Resend and add:

- **Name:** `FROM_EMAIL`
- **Value:** `hello@yourdomain.com`

- **Name:** `FROM_LABEL`
- **Value:** `Send in Bloom`

## Local development

```bash
npm i -g vercel
vercel dev
```

`vercel dev` automatically loads `RESEND_API_KEY` from `.env.local` (already configured).

## Limits

- **Free tier:** 3,000 emails/month
- **Paid:** 100,000 emails/day
