# Contributing to Solus

Thank you for your interest in contributing to Solus! We are building the world's first **Personal Social Network**—a private-first digital diary optimized for self-reflection rather than social performance.

By contributing to this repository, you help shape a healthier, mindful relationship with technology.

---

## Code of Conduct

We expect all contributors to follow a respectful, welcoming, and collaborative code of conduct. Please treat fellow developers with kindness.

---

## Technical Stack & Architecture

Solus is built with a modern, high-performance edge-first stack:
- **Core**: Next.js 16 (App Router), React 19, TypeScript (Strict Mode).
- **Styling**: Tailwind CSS 4.
- **Backend & Database**: Hono Router + Server Actions, Prisma / Drizzle ORM, Neon PostgreSQL.
- **Authentication**: Better Auth.

Before writing code, please review our codebase principles:
1. **Private by Default**: Never introduce features that leak user details, expose feeds publicly, or support vanity engagement metrics (comments/likes on other users' profiles, follower counts, etc.).
2. **Server-First Components**: Prefer Next.js Server Components. Use `"use client"` only for forms, interactive overlays, or client-side animations.
3. **No Magic Values**: Extract configuration constants into structured config blocks.
4. **Accessible UI**: Always use semantic HTML, clear focus states, and keyboard-friendly attributes.

---

## Contribution Workflow

### 1. Fork and Clone
Fork the repository to your GitHub account, then clone it locally:
```bash
git clone https://github.com/YOUR-USERNAME/solus.git
cd solus
```

### 2. Set Up Environment Variables
Copy the example environment file and fill in your values (Better Auth parameters, Neon Database URL, Google OAuth IDs):
```bash
cp .env.example .env
```

### 3. Install Dependencies
We recommend using **Bun** to keep compile speeds fast:
```bash
bun install
```

### 4. Running the App Local Dev Server
Start the Next.js development server:
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Pull Request Guidelines

To maintain code quality and ensure fast merging, please adhere to these rules:

### Branch Naming
Create a descriptive feature branch from the `main` branch:
- For new features: `feat/feature-name`
- For bug fixes: `fix/bug-name`
- For documentation: `docs/doc-name`
- For styling refactoring: `style/style-name`

### Coding Style & Linting
Run the linter and TypeScript compiler before committing:
```bash
bun run lint
```
Make sure all TypeScript files compile with no errors.

### Git Commits
Write clean, descriptive conventional commits:
- `feat(stories): add video playback loop in story details`
- `fix(comments): resolve comment text clipping on mobile views`
- `docs(readme): update setup prerequisites in getting started`

### Submitting PRs
1. Push your branch to your forked repository.
2. Submit a Pull Request targeting the `main` branch of `SH20RAJ/solus`.
3. Provide a clear description of the problem solved, changes made, and visual screenshots or videos demonstrating the updates.

Thank you again for making Solus a digital sanctuary for self-reflection! 🧘
