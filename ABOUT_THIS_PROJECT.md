# PortfolioForge

PortfolioForge is a Next.js-based web application for building personalized portfolios. It allows users to authenticate, build, and deploy their portfolios dynamically. It uses Next.js (App Router), Drizzle ORM with Postgres, Tailwind CSS, NextAuth for authentication, Stripe for payments, Resend for emails, and integrates AI features via Google's Generative AI.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** NextAuth.js (Auth.js beta) with GitHub and Google providers
- **Styling:** Tailwind CSS, Radix UI primitives, Lucide React icons
- **State Management:** React Contexts and Hooks
- **Payments:** Stripe
- **Emails:** Resend
- **Rate Limiting & Caching:** Upstash Redis
- **Storage:** AWS S3
- **AI Integration:** Google Generative AI (`@google/generative-ai`)
- **Drag & Drop:** `@dnd-kit` (for the interactive portfolio builder interface)

## Directory Structure and Files

### `/app`
Contains all the application routes, following the Next.js App Router conventions.
- `admin/`: Admin dashboard and functionality.
- `api/`: Backend API routes (e.g., Stripe webhooks, NextAuth endpoints).
- `auth/`: Authentication pages (e.g., signin, error pages).
- `dashboard/`: User dashboard where they manage and build their portfolios.
- `docs/`: Documentation pages.
- `patterns/`: UI patterns and templates.
- `personalize/`: Onboarding or personalization flows for new users.
- `preview/`: Live preview routes for user portfolios.
- `privacy/` & `terms/`: Legal pages.
- `u/`: Public profile routes for users (e.g., `u/[slug]`).
- `page.tsx`: The main landing page.
- `layout.tsx`: Root layout for the application.
- `globals.css`: Global styles including Tailwind CSS directives.

### `/components`
Contains reusable React UI components.
- `landing/`: Components specific to the application landing page.
- `library/`: A library of components for the drag-and-drop portfolio builder.
- `preview/`: Components used for rendering the portfolio preview.
- `primitives/`: Low-level UI building blocks.
- `sections/`: Section-level components (e.g., Hero, Footer, Feature sections).
- `ui/`: Core UI components (often derived from shadcn/ui or Radix UI).
- `UpgradeModal.tsx`: Modal component for upgrading user plans (e.g., to Pro via Stripe).

### `/lib`
Contains utility functions, database configurations, and external service integrations.
- `actions/`: Next.js Server Actions for handling form submissions and mutations.
- `ai/`: Logic for AI integrations (Google Generative AI integration).
- `db/`: Database schema, connection setup (`schema.ts`), and Drizzle configuration.
- `analytics.ts`: Tracking and analytics logic.
- `demo-data.ts`: Mock or placeholder data for testing and previews.
- `email.ts`: Email sending logic using the Resend API.
- `gate.ts`: Feature flagging or access control logic based on user roles.
- `rate-limit.ts`: Rate limiting implementation using Upstash Redis.
- `redis.ts`: Redis connection and helper functions.
- `slug.ts`: Utilities for generating URL-friendly slugs for user portfolios.
- `stripe.ts`: Stripe payment integration setup.
- `themes.ts`: Theme definitions and utilities for portfolios.

### `/hooks`
Custom React hooks.
- `useBuilderState.ts`: State management hook for the drag-and-drop portfolio builder.

### `/contexts`
React contexts for global state management.

### `/types`
TypeScript type definitions used across the project to maintain type safety.

### Root Configuration Files
- `package.json` & `package-lock.json`: Dependency management and npm scripts.
- `next.config.ts`: Next.js configuration.
- `auth.ts`: NextAuth configuration, including providers (GitHub, Google), session strategy, callbacks, and events (like auto-creating a portfolio upon user signup).
- `drizzle.config.ts`: Drizzle ORM configuration for schema generation and database migrations.
- `eslint.config.mjs`: ESLint configuration for code linting.
- `tsconfig.json`: TypeScript compiler configuration.
- `.env.example` / `.env.local`: Environment variable templates and local overrides.
- `README.md`: Basic instructions on getting started and running the development server.
