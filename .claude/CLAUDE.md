# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ISKCON Course Portal — a multi-step temple registration web app. Temples register themselves (with President and Vice President details) to gain access to the ISKCON Course Portal. The project was originally generated from Figma Make.

## Repository Structure

```
SourceCode/
  frontend/   # React + TypeScript SPA (Vite, pnpm)
  backend/    # Express.js REST API (CommonJS, npm, Prisma + SQLite)
```

## Commands

### Frontend (`SourceCode/frontend/`)

```bash
pnpm dev       # start dev server at http://localhost:5173
pnpm build     # production build to dist/
```

### Backend (`SourceCode/backend/`)

```bash
npm run dev          # start with nodemon (auto-reload)
npm start            # start without auto-reload
npm run db:push      # push schema changes to SQLite (no migration files)
npm run db:studio    # open Prisma Studio GUI
```

## Architecture

### Frontend

Single-page app — no router. `src/app/App.tsx` is both the shell and the state container: it holds all form state (`templeData`, `presidentData`, `vicePresidentData`), step-level validation functions, and the final `handleSubmit` that POSTs multipart/form-data to the backend. Step components receive data + `onChange` + `errors` as props and are purely controlled.

**Component layout:**
- `src/app/components/steps/` — Step1–Step5 form steps (Step5 is the success screen)
- `src/app/components/form/` — `FormField` (label + input + error), `Stepper` (progress indicator)
- `src/app/components/layout/` — `Header`, `Footer`
- `src/app/components/ui/` — shadcn/ui components (Radix UI wrappers); treat as a library, don't modify unless adding new primitives
- `src/app/components/figma/` — Figma-specific helpers (e.g. `ImageWithFallback`)

**Key details:**
- `@` alias resolves to `./src`
- `figma:asset/<filename>` imports resolve to `src/assets/`; this is a custom Vite plugin — do not remove it
- Tailwind CSS v4 via `@tailwindcss/vite`; both the React and Tailwind plugins must stay in `vite.config.ts`
- API base URL from `VITE_API_URL` env var; falls back to `http://localhost:3001`

### Backend

Express app (CommonJS) with two route groups:

| Route | Purpose |
|-------|---------|
| `POST /api/otp/send` | Create OTP session; returns OTP in response body in non-production |
| `POST /api/otp/verify` | Mark OTP session as verified |
| `POST /api/registrations` | Create registration (multipart/form-data, 5 file fields) |
| `GET /api/registrations/:id` | Fetch full registration with file URLs |

**File upload:** Multer stores uploads in `SourceCode/backend/uploads/`. Allowed: JPEG, PNG, GIF, WebP, PDF. Max 5 MB each. The five expected field names are `templeLogo`, `presidentPhoto`, `presidentGovtIdFile`, `vpPhoto`, `vpGovtIdFile`.

**Registration flow (POST /api/registrations):**  
Flat prefixed FormData keys (e.g. `presidentFullName`, `vpMobile`) → server validator (`src/validators/registration.js`) → Prisma nested create: one `Registration` → one `Temple` + two `Person` records (roles `president` / `vice_president`) → each `Person` → zero or more `FamilyMember` rows. `referenceNumber` returned to client is `registration.id.slice(0, 8).toUpperCase()`.

### Database (Prisma + SQLite)

Schema: `Registration` → `Temple` (1:1) and `Person[]` (1:many) → `FamilyMember[]` (1:many). `OtpSession` is separate.

The SQLite file is at `prisma/dev.db`. Schema changes: edit `prisma/schema.prisma` then run `npm run db:push` (no migration history).

## Environment Variables

**Backend** — copy `.env.example` to `.env`:
```
PORT=3001
DATABASE_URL="file:./dev.db"
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend** — create `SourceCode/frontend/.env`:
```
VITE_API_URL=http://localhost:3001
```

## Development Notes

- In development, OTP is always `123456` (hardcoded in `otp.controller.js`). The production path requires wiring in an SMS gateway (MSG91/Twilio); see the `TODO` comment in that file.
- Validation logic is duplicated intentionally: client-side in `App.tsx` (fast UX feedback) and server-side in `src/validators/registration.js` (authoritative). Keep them in sync when adding/changing fields.
- The frontend uses both shadcn/ui (Radix) and MUI (`@mui/material`) — prefer shadcn/ui components in `src/app/components/ui/` for new UI work to stay consistent with the existing step components.
