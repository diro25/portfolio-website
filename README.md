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

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run db:push` — sync the Prisma schema to the database
