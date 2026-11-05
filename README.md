# Diriba Adugna Teka — Full-Stack Portfolio

Personal portfolio built with Next.js, TypeScript, Prisma, and SQLite.

## Features

- Responsive portfolio homepage
- Projects, skills, social links, and profile image
- Validated contact form backed by a database
- Password-protected admin inbox at `/admin`

## Local setup

```bash
npm install
cp .env.example .env
npm run db:push
npm run dev
```

Set a strong `ADMIN_PASSWORD` in `.env` before using the admin inbox. The
development database is SQLite; it can be switched to PostgreSQL for deployment
by updating the Prisma datasource and `DATABASE_URL`.

Set `NEXT_PUBLIC_SITE_URL` to your public domain before deploying so sitemap and
social metadata use the correct URL.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run db:push` — sync the Prisma schema to the database

Vercel uses the `vercel-build` script, which synchronizes the Prisma schema
against the configured PostgreSQL database before building the application.
