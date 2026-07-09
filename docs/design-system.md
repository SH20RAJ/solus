# Solus — Design System

**Version:** 1.0
**Base grid:** 4px · **Spacing rhythm:** 8pt

This document is the single source of truth for color, typography, spacing,
radius, shadows, layout, and design tokens. Never invent values outside this
system.

---

## 1. Color System

### 1.1 Light Theme

| Role              | Token              | Hex       | Notes                     |
| ----------------- | ------------------ | --------- | ------------------------- |
| Primary           | `--primary`        | `#0F172A` | Slate 900                 |
| Background        | `--background`     | `#FFFFFF` | App background            |
| Surface           | `--surface`        | `#FAFAFA` | Subtle raised surface     |
| Card              | `--card`           | `#FFFFFF` | Cards / dialogs           |
| Border            | `--border`         | `#E5E7EB` | Hairline dividers         |
| Text Primary      | `--text-primary`   | `#111827` | Headings / body           |
| Text Secondary    | `--text-secondary` | `#6B7280` | Supporting text           |
| Text Muted        | `--text-muted`     | `#9CA3AF` | Timestamps / hints        |
| Accent            | `--accent`         | `#3B82F6` | Soft blue — actions only  |

### 1.2 Dark Theme

| Role         | Token              | Hex       |
| ------------ | ------------------ | --------- |
| Background   | `--background`     | `#09090B` |
| Card         | `--card`           | `#18181B` |
| Border       | `--border`         | `#27272A` |
| Text         | `--text-primary`   | `#FAFAFA` |
| Muted        | `--text-muted`     | `#A1A1AA` |
| Accent       | `--accent`         | `#60A5FA` |

### 1.3 Semantic Colors

| Role     | Hex       |
| -------- | --------- |
| Success  | `#22C55E` |
| Warning  | `#F59E0B` |
| Danger   | `#EF4444` |

### 1.4 Color Rules

- The accent color is used **only** for actions — never decoration.
- Maximum **2 accent colors** per screen.
- **Never** use bright gradients, neon colors, or gaming aesthetics.

---

## 2. Typography

**Primary font:** Geist · **Alternative:** Inter

### 2.1 Type Scale (px — never invent sizes)

```
12 · 14 · 16 · 18 · 20 · 24 · 30 · 36 · 48
```

### 2.2 Weights

```
400 (Regular) · 500 (Medium) · 600 (Semibold) · 700 (Bold)
```

- Headings → Bold (700)
- Body → Regular (400)

### 2.3 Line Height

- Body: **150%**
- Headings: **120%**

### 2.4 Typography Rules

- **Always left-align.** Never justify text.
- Maximum **3 text sizes per screen**.

---

## 3. Spacing

**Base unit:** 4px. Use only these values:

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 96
```

### Padding conventions

| Context       | Value  |
| ------------- | ------ |
| Card padding  | 24px   |
| Mobile screen | 16px   |
| Desktop       | 24px   |

---

## 4. Radius

| Element  | Radius |
| -------- | ------ |
| Buttons  | 12px   |
| Inputs   | 14px   |
| Cards    | 20px   |
| Images   | 24px   |
| Dialogs  | 24px   |

Rule: **Never place two different border radii in the same component.**

---

## 5. Shadows

Only **three** shadow levels exist:

- **Small** — subtle lift (cards at rest)
- **Medium** — raised surfaces (dropdowns, popovers)
- **Large** — modal / dialog elevation

Avoid dramatic shadows. Never add a fourth.

---

## 6. Layout

| Measure        | Value  |
| -------------- | ------ |
| Content width  | 760px  |
| Reading width  | 680px  |
| Maximum width  | 960px  |

Everything is centered.

### Grid

| Breakpoint | Columns |
| ---------- | ------- |
| Desktop    | 12      |
| Tablet     | 4       |
| Mobile     | 2       |

---

## 7. Responsive Breakpoints

**Mobile first.**

```
320 · 375 · 390 · 768 · 1024 · 1280 · 1536
```

---

## 8. Iconography

- **Library:** Lucide
- **Stroke width:** 1.75
- **Sizes:** 16 · 20 · 24 · 32

---

## 9. Avatar Sizes

```
32 · 40 · 48 · 64 · 96
```

---

## 10. Design Tokens

Everything is tokenized. Examples:

| Category    | Token example  |
| ----------- | -------------- |
| Radius      | `--radius-lg`  |
| Spacing     | `--space-4`    |
| Color       | `--primary`    |
| Typography  | `--font-body`  |

Never hardcode a value that has a token.

---

## 11. Pixel-Perfect Rules

- 8pt spacing grid.
- Optical alignment over mathematical alignment.
- Icons aligned to text baseline.
- Never two different border radii in one component.
- Keep vertical rhythm consistent.
- Maximum 3 text sizes per screen.
- Maximum 2 accent colors.
- One primary CTA per screen.
- Never exceed 3 levels of visual hierarchy.
- No element should exist without a purpose.
