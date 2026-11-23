# Diriba Adugna Teka — Personal Portfolio

A full-stack personal portfolio built with Next.js and TypeScript. It presents projects and experience, collects contact messages, publishes blog posts and moderated comments, records basic page analytics, and includes an authenticated admin dashboard for content management.

## Tech Stack

- **Framework:** Next.js 16 with React 19
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma 6
- **Validation:** Zod
- **Styling:** CSS
- **Deployment:** Vercel

## Features

- Responsive portfolio homepage with skills, experience, competitive-programming statistics, social links, and profile image
- Published-project listing and individual project detail pages
- Zod-validated contact form backed by the PostgreSQL database
- Blog listing and article pages
- Comment submission with an approval workflow
- Password-protected admin dashboard at `/admin`
- Admin tools for:
  - Reviewing and marking contact messages as read
  - Creating, editing, publishing, and deleting projects
  - Creating, editing, publishing, and deleting blog posts
  - Approving, hiding, or deleting comments
  - Viewing page-view totals and recent traffic
- Basic page-view analytics
- Open Graph and Twitter metadata
- Person structured data
- Dynamic sitemap and robots configuration

## Project Structure

```text
app/
  admin/                 # Password-protected content dashboard
  api/                   # Projects, blog posts, comments, analytics, and contact routes
  blog/                  # Blog index and individual article pages
  components/            # Client and shared UI components
  projects/              # Project detail pages
  globals.css            # Global styles
  layout.tsx             # Root layout and metadata
  page.tsx               # Portfolio homepage
lib/
  prisma.ts              # Shared Prisma client
prisma/
  schema.prisma          # PostgreSQL data models
  seed.ts                # Initial project seed data
  blog-seed.ts           # Optional blog seed data
public/
  myphoto.JPG            # Profile image
middleware.ts            # Basic admin/API route protection
```

## Environment Variables

Create `.env` in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
ADMIN_PASSWORD="replace-with-a-strong-password"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma |
| `ADMIN_PASSWORD` | Yes | Password used by the protected `/admin` routes and admin APIs |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public site URL used for metadata, sitemap URLs, and Open Graph metadata |

Use a strong, unique `ADMIN_PASSWORD`. The password is accessed by server-side and middleware code; do not commit `.env` or real credentials.

## Local Setup

### Prerequisites

- Node.js 20 or newer
- npm
- A PostgreSQL database

### Installation

```bash
npm install
cp .env.example .env
```

Update `.env` with your PostgreSQL connection string, admin password, and local site URL.

Create or update the database tables:

```bash
npm run db:push
```

Optionally seed the project catalog:

```bash
npm run db:seed
```

To seed blog content, if configured for your database:

```bash
npm run db:seed:blog
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

The admin dashboard is available at `http://localhost:3000/admin` and prompts for the password configured by `ADMIN_PASSWORD`.

## Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Generate the Prisma client and create a production build |
| `npm run vercel-build` | Generate Prisma, push the schema, and build on Vercel |
| `npm run start` | Start the production server |
| `npm run lint` | Run the configured Next.js lint script |
| `npm run db:push` | Push `prisma/schema.prisma` to PostgreSQL |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:seed` | Seed initial project records |
| `npm run db:seed:blog` | Seed initial blog records |

## Production Deployment

The repository includes a `vercel-build` script for Vercel:

```text
prisma generate && prisma db push && next build
```

Configure these environment variables in the deployment platform:

- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`

Set `NEXT_PUBLIC_SITE_URL` to the final public origin, without a trailing path, for example `https://example.com`.

## Database Models

Prisma manages these models:

- `Project`
- `BlogPost`
- `Comment`
- `ContactMessage`
- `AnalyticsEvent`

Projects and blog posts support publishing controls. Comments remain pending until approved in the admin dashboard, and contact messages can be marked as read or unread.

## Profile Summary

Computer Science & Engineering student and full-stack developer building portfolio and content-driven applications with Next.js, TypeScript, React, Node.js, PostgreSQL, and Prisma.
