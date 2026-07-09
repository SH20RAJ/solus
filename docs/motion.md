# Solus — Motion & Interaction

Motion in Solus is quiet. It confirms and guides — it never performs. When in
doubt, use less.

---

## 1. Duration

Use only these durations:

```
150ms · 200ms · 300ms
```

**Never longer than 300ms.**

| Use                         | Duration |
| --------------------------- | -------- |
| Micro-feedback (tap, hover) | 150ms    |
| Standard transitions        | 200ms    |
| Larger surfaces (modals)    | 300ms    |

---

## 2. Easing

**`ease-out` only.**

Motion should decelerate into place — arriving gently, never overshooting.

---

## 3. Allowed Animations

Only three:

- **Fade**
- **Scale**
- **Slide**

Nothing else.

---

## 4. Forbidden Motion

- Never **bounce**.
- Never **shake**.
- Never **flashy** or attention-grabbing motion.
- Never **confetti**.
- Never parallax spectacle.

---

## 5. Microinteractions

| Event          | Motion                     |
| -------------- | -------------------------- |
| Post saved     | Tiny fade                  |
| Story uploaded | Tiny progress indicator    |
| Publish        | Gentle success animation   |

Feedback should be felt, not celebrated.

---

## 6. Haptics

Trigger haptics **only** for:

- Success
- Delete confirmation
- Publish

Nothing else.

---

## 7. Sound

- **Off by default.**
- No unnecessary sounds — ever.

---

## 8. Reduced Motion

Respect `prefers-reduced-motion`. When enabled:
- Replace slide/scale with instant or simple opacity change.
- Disable any non-essential transition.

---

## 9. Interaction Principles

- Every transition has a reason (state change, navigation, feedback).
- Motion should never delay the user from completing a task.
- Loading transitions prefer skeletons over spinners (see `components.md`).
- Motion should reinforce calm, not create urgency.
