# Engitrack Blog

Multi-page blog built with Next.js App Router, NextAuth credentials auth, MongoDB via Mongoose, and markdown post rendering.

## Features

- Sign up with name, email, and bcrypt-hashed password
- Log in and log out with NextAuth credentials sessions
- Public homepage with newest-first SSR post listing
- Public post detail pages at `/posts/[slug]` with markdown rendering
- Authenticated dashboard for creating, editing, and deleting your own posts
- Server-side ownership checks for all post mutations
- Server-side validation for title and body length

## Setup

1. Copy `.env.example` to `.env.local`
2. Fill in:
   - `MONGODB_URI`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
3. Install dependencies:

```bash
npm install
```

4. Start the dev server:

```bash
npm run dev
```

5. Open `http://localhost:3000`

## Validation rules

- `title`: 1 to 200 characters
- `body`: 1 to 10000 characters
- password: minimum 8 characters

## Notes

- Slugs are generated from the title and made unique automatically.
- Homepage and post detail pages are server-rendered on demand.
- Without a valid MongoDB Atlas connection string, the data-backed routes cannot load.

## Vercel deployment

Set environment variables in Vercel for the correct environments:

- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Recommended values:

- Local development: `NEXTAUTH_URL=http://localhost:3000`
- Production: `NEXTAUTH_URL=https://your-production-domain.vercel.app`
- Preview: either leave `NEXTAUTH_URL` unset or set it to that preview deployment URL

Do not store multiple URLs in `NEXTAUTH_URL`.

For MongoDB Atlas, use a connection string with a database name:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/engitrack-blog?retryWrites=true&w=majority&appName=<app-name>
```

Atlas must also allow the deployment to connect under `Security -> Network Access`.
