# Solus — Component Specifications

Component specs inherit tokens from `design-system.md`. Each component lists its
structure, sizing, states, and the Solus-specific rules that make it feel calm.

---

## 1. Buttons

**Maximum four variants:**

| Variant   | Style        | Use                          |
| --------- | ------------ | ---------------------------- |
| Primary   | Filled       | The one primary action       |
| Secondary | Outline      | Supporting action            |
| Ghost     | Text only    | Low-emphasis / tertiary      |
| Danger    | Red          | Destructive confirmation     |

**Sizing**
- Minimum height: **44px**
- Minimum touch target: **44 × 44px**
- Radius: **12px**

**States:** default · hover · active · focus (visible ring) · disabled · loading.

**Rules**
- One primary button per screen.
- Danger buttons always require confirmation.

---

## 2. Inputs

- Height: **48px**
- Radius: **14px**
- **Label above** the field — never floating labels.

**States:** default · focus · filled · error · disabled.

**Rules**
- One idea per input.
- Error text appears below the field in the danger color.
- Placeholder is a hint, never a replacement for a label.

---

## 3. Cards

- Padding: **24px**
- Radius: **20px**
- Internal gap: **16px**
- Background: white (light) / `#18181B` (dark)
- Minimal borders — prefer whitespace and a small shadow over heavy outlines.

---

## 4. Avatar

Sizes: `32 · 40 · 48 · 64 · 96`. Always circular. Fall back to initials on a
neutral surface when no image is present.

---

## 5. Images

- Rounded corners: **24px**
- **Lazy loaded** always.
- Supported aspect ratios: **1:1 · 4:5 · 16:9**.
- Never crop a user's memory destructively without a way to view the original.

---

## 6. Navigation

### Mobile — Bottom Navigation
```
Home  ·  Timeline  ·  +  ·  Stories  ·  Profile
```
The `+` is the central create action.

### Desktop — Sidebar
- Left sidebar navigation.
- **No top navbar.**

---

## 7. Home Screen

Vertical order:
1. **Greeting** — e.g. "Good morning." with a small subtitle.
2. **Today's memories.**
3. **Timeline.**
4. **Floating FAB** (`+`).

Nothing else.

---

## 8. Timeline

- Large cards.
- Generous spacing between entries.
- Readable captions.
- Minimal chrome.

---

## 9. Stories

- Horizontal row.
- Large circles with a soft border.
- **No** viewer count, seen count, or reactions.

---

## 10. Post

A post contains only:
- Photo / video
- Caption
- Date
- Location *(optional)*
- Mood *(optional)*

**Never:** likes, comments, shares.

---

## 11. Empty States

Structure:
1. Illustration
2. One sentence
3. One CTA

Example copy: *"You haven't captured today yet."*

---

## 12. Loading

- Use **skeletons**, not spinners, wherever possible.
- Skeletons should match the shape of the content they replace.

---

## 13. Error Pages

Friendly · minimal · explain what happened · offer a way to recover.

---

## 14. Floating Action Button (FAB)

- Single primary create action (`+`).
- Present on Home and Timeline.
- Positioned bottom-right (desktop) / above bottom nav (mobile).

---

## 15. Dialogs / Modals

- Radius: **24px**
- Large shadow elevation.
- One primary action, one dismiss.
- Dismissible via backdrop tap, Escape key, and a visible close control.
