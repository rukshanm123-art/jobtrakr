# JobTrakr

A professional job application tracker built with Next.js, TypeScript, Prisma, and PostgreSQL. Log every application, track status changes, and understand your job search through analytics — all in one clean interface.

---

## Features

- **Application tracking** — log company, role, location, salary, job URL, and notes
- **Status pipeline** — 8 statuses from Applied through to Offer, Rejected, or Withdrawn
- **Timeline** — every status change recorded with timestamps and optional notes
- **Dashboard** — animated counters, pipeline visualisation, and recent applications at a glance
- **Analytics** — weekly trend chart, active pipeline bar chart, status breakdown donut chart
- **Search and filter** — search by company or role, filter by status, sort by date or company
- **Authentication** — email/password auth with JWT sessions via NextAuth.js

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| ORM | Prisma 5 |
| Database | PostgreSQL (Neon) |
| Auth | NextAuth.js credentials |
| Deployment | Vercel |

---

## Quick Start

```bash
git clone https://github.com/rukshanm123-art/jobtrakr.git
cd jobtrakr
npm install
cp .env.example .env   # fill in your values
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000.

---

## Deployment

### 1. Create a Neon database

Sign up at [neon.tech](https://neon.tech) (free tier). Copy the connection strings — one pooled, one direct.

### 2. Deploy to Vercel

1. Import the repository at [vercel.com/new](https://vercel.com/new)
2. Add environment variables (see below)
3. Vercel runs `prisma generate` automatically via the build step
4. After first deploy, run: `npx prisma migrate deploy`

---

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host/jobtrakr?sslmode=require"
DIRECT_URL="postgresql://user:password@host/jobtrakr?sslmode=require"
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="https://your-vercel-url.vercel.app"
```

---

## Project Structure

```
jobtrakr/
├── app/
│   ├── (app)/                  Protected routes (require auth)
│   │   ├── dashboard/          Home screen with stats and recent apps
│   │   ├── applications/       Application list with search and filter
│   │   │   ├── new/            Add new application form
│   │   │   └── [id]/           Application detail, timeline, and edit
│   │   └── analytics/          Charts and pipeline metrics
│   ├── api/
│   │   ├── applications/       CRUD REST endpoints
│   │   ├── auth/               NextAuth.js handler
│   │   ├── register/           User registration
│   │   └── stats/              Analytics data aggregation
│   ├── login/
│   └── register/
├── components/
│   ├── AnimatedCounter.tsx     Eased number animation on value change
│   ├── ApplicationCard.tsx     Card with coloured status accent bar
│   ├── ApplicationForm.tsx     Shared create and edit form
│   ├── Pipeline.tsx            Animated bar chart for status funnel
│   ├── Sidebar.tsx             Navigation with spring active indicator
│   ├── StatusBadge.tsx         Coloured status pill
│   └── Timeline.tsx            Vertical event history with dots
├── lib/
│   ├── auth.ts                 NextAuth configuration
│   ├── prisma.ts               Prisma client singleton
│   └── types.ts                TypeScript types and status colour config
└── prisma/
    └── schema.prisma           User, Application, Event models
```

---

## License

MIT
