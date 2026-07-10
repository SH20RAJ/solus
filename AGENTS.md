# AGENTS.md

> AI Development Guide for Solus
>
> This document defines the engineering standards, architecture, coding style,
> and project philosophy for every AI agent and human contributor working on
> this repository.

---

# Project Philosophy

Solus is intentionally simple.

Every feature should reinforce the core idea:

> Live first. Share later.

Never add complexity without a clear user benefit.

When in doubt:

- Remove features.
- Simplify UX.
- Prefer clarity over cleverness.

---

# Tech Stack

Framework

- Next.js 15+
- App Router
- React 19
- TypeScript

UI

- Tailwind CSS
- shadcn/ui
- Lucide Icons

Backend

- Server Actions
- Route Handlers
- Prisma ORM
- PostgreSQL

Validation

- Zod

Deployment

- Vercel

Authentication

- Better Auth / Auth.js

Storage

- S3 / Cloudflare R2

---

# General Principles

Always

✅ Type-safe

✅ Accessible

✅ Mobile-first

✅ Server-first

✅ Secure

✅ Fast

Avoid

❌ Overengineering

❌ Premature optimization

❌ Huge abstractions

❌ Deep component nesting

❌ Massive files

---

# Folder Structure

app/

components/

features/

lib/

actions/

hooks/

prisma/

types/

utils/

styles/

public/

Never create folders without a reason.

---

# Next.js Rules

Always use App Router.

Never use Pages Router.

Prefer:

Server Components

Only use Client Components when required.

Examples:

Good

- forms
- animations
- state
- drag and drop

Bad

- fetching data
- layouts
- static pages

---

# Server Components

Server Components are the default.

Only add

"use client"

when absolutely necessary.

Never convert an entire page into a Client Component because one button needs it.

Move the button into its own component.

---

# Data Fetching

Prefer

Server Components

↓

Server Actions

↓

Route Handlers

↓

Client Fetch

Never fetch from your own API inside a Server Component.

BAD

Server Component

↓

fetch("/api/posts")

GOOD

Server Component

↓

Prisma

---

# Server Actions

Prefer Server Actions over API routes.

Use Route Handlers only when:

- webhooks
- external APIs
- mobile apps

---

# TypeScript

Strict mode required.

Never use

any

Prefer

unknown

or

generic types

Always type:

Props

Returns

Functions

Database models

---

# Components

Keep components small.

Target:

50–150 lines

Maximum:

300 lines

Split large components.

---

# Component Rules

One responsibility.

Never mix

UI

Business Logic

Database

in one file.

---

# Naming

Components

UserCard.tsx

SettingsDialog.tsx

Hooks

useUser.ts

usePosts.ts

Utilities

formatDate.ts

cn.ts

Database

user.service.ts

---

# Styling

Tailwind only.

Never write inline styles.

Never use

!important

Prefer utility classes.

Extract reusable UI.

---

# shadcn/ui

Always use shadcn components.

Do not reinvent:

Button

Dialog

Popover

Dropdown

Input

Textarea

Card

Badge

---

# State Management

Prefer

Server State

↓

URL State

↓

Local State

↓

Global State

Use React state only when necessary.

Avoid global state unless truly shared.

---

# Forms

Use

React Hook Form

+

Zod

Never manually validate forms.

---

# Validation

Everything is validated.

Client

+

Server

Never trust client input.

---

# Database

Prisma only.

Never write raw SQL unless necessary.

Always:

- indexes
- foreign keys
- relations

Never duplicate data.

---

# Authentication

Always verify

session

server-side.

Never trust:

userId

email

role

coming from the client.

---

# Authorization

Authentication

≠

Authorization

Every protected action must verify ownership.

Example

User can only edit

their own posts.

---

# Environment Variables

Never expose secrets.

Server

process.env

Client

NEXT_PUBLIC_

Nothing else.

---

# Error Handling

Never

console.log

errors in production.

Use

try/catch

Return meaningful messages.

---

# Logging

Development

console.log()

Production

structured logging

Never log

passwords

tokens

emails

---

# Security

Always

sanitize input

validate output

escape HTML

protect uploads

check MIME types

limit file sizes

rate limit APIs

---

# Performance

Prefer

Server Components

Streaming

Suspense

Dynamic Imports

Optimize:

Images

Fonts

Bundles

---

# Images

Always use

next/image

Never use

img

unless absolutely required.

---

# Fonts

Use

next/font

Never import Google Fonts manually.

---

# SEO

Every page needs

title

description

metadata

Open Graph

Twitter Card

Canonical URL

---

# Accessibility

Every interactive element

must be keyboard accessible.

Always

aria-label

button labels

focus states

semantic HTML

---

# Code Quality

Every function should be

easy to read.

Prefer

early returns

Avoid

deep nesting

Example

Bad

if (...)

    if (...)

        if (...)

Good

if (!user) return

if (!post) return

...

---

# Comments

Only explain

WHY

Never explain

WHAT

Good

// Prevent duplicate uploads

Bad

// Increment i

---

# Imports

Order

1.

React

2.

Next.js

3.

Libraries

4.

Internal

5.

Relative

Alphabetically sorted.

---

# Constants

Never use

magic numbers

Extract constants.

---

# API Design

Always return

success

data

error

Example

{
  success: true,
  data: ...
}

---

# Git

Commit messages

feat:

fix:

refactor:

docs:

style:

test:

chore:

Example

feat(posts): add scheduled publishing

---

# Testing

Prefer

Vitest

React Testing Library

Test

critical business logic

before UI.

---

# Pull Requests

Every PR should

- compile

- pass lint

- pass tests

- have no TypeScript errors

---

# Anti Patterns

Never

❌ huge files

❌ duplicated code

❌ unnecessary abstractions

❌ prop drilling everywhere

❌ client-side fetching by default

❌ storing derived state

❌ useEffect for everything

❌ premature optimization

❌ mutable globals

❌ hidden side effects

---

# Solus Product Rules

Every feature must answer:

Does this help users

document life privately?

If not,

don't build it.

Privacy is the default.

Sharing is optional.

Never introduce features that encourage:

- doom scrolling
- engagement farming
- vanity metrics
- addictive notifications

The product should optimize for

reflection,

not attention.

---

# AI Agent Instructions

When modifying this project:

1. Preserve existing architecture.

2. Keep files small.

3. Do not introduce unnecessary dependencies.

4. Prefer built-in Next.js features.

5. Prefer composition over inheritance.

6. Never disable TypeScript errors.

7. Never ignore ESLint.

8. Never use `any`.

9. Never expose secrets.

10. Always consider mobile first.

11. Always optimize for readability.

12. Prefer server components.

13. Prefer server actions.

14. Keep business logic out of UI components.

15. Leave the codebase cleaner than you found it.

16. NEVER use `"use client";` in `page.tsx` or `layout.tsx` files. Always make them Server Components, export metadata there, and delegate client-side state/effects to imported client component wrappers (e.g. `*PageClient.tsx`).

---

# Current Codebase Context

- **Routing & Rendering Architecture**: Fully standard App Router. All `page.tsx` and `layout.tsx` files are Server Components exporting Next.js SEO `metadata`. Client states are delegated to `src/components/pages/*PageClient.tsx` wrappers.
- **Ambient Healing Sound (396Hz)**: Mounted globally within `src/app/(landing)/layout.tsx` (the landing and pitch pages shared layout) so the sound does not restart when transitioning between `/` and `/pitch`.
- **Feed Infinite Scroll**: Recent Reflections feed uses pagination (`limit` & `offset` query params) with an Intersection Observer trigger at the bottom.
- **Hashtags & Location Tagging**: Captions are parsed using `formatCaption` mapping tags to `/tags/[tag]` routes. Location tags on postcards are mapped to `/locations/[location]` routes. Both display custom streams.
- **Profile Dashboard**: Focuses on private reflection insights: contains stats widgets, a segmented horizontal Mood Map bar, and a memory directory table rather than clone grids.

---

# Definition of Done

A task is complete only if:

- Builds successfully
- No lint errors
- No TypeScript errors
- Responsive
- Accessible
- Secure
- Tested (if applicable)
- Readable
- Documented (if needed)

If any of these are missing, the task is not complete.