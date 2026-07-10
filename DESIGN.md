# Solus — Product Design Document

## Vision

**Leave everyone. Don't leave yourself.**

Solus is a private-first social platform where people document their lives without an audience. It recreates the familiar experience of social media—posts, stories, photos, videos, and a personal timeline—but removes the pressure of likes, followers, comments, and algorithms.

The default experience is solitude.

Users can later choose to publish part or all of their journey.

---

# Problem

Modern social media encourages performance instead of presence.

People constantly think:

- Will this get likes?
- What will people think?
- Is this worth posting?

Many people deactivate social media to escape this pressure, but they also stop documenting their lives.

Solus solves that.

---

# Core Philosophy

> Live first. Share later.

Social media should help people remember their lives—not perform them.

---

# Product Principles

- Private by default
- No followers
- No likes
- No comments
- No public discovery
- No algorithmic feed
- Sharing is always optional

---

# Target Users

- Solo travelers
- Students preparing for competitive exams
- Startup founders
- Creators taking a break
- People on digital detoxes
- People recovering from burnout or breakups
- Anyone who wants to rediscover themselves

---

# User Journey

1. Create an account.
2. Start posting privately.
3. Build a personal timeline.
4. Reflect on memories.
5. Optionally publish when ready.

---

# Features (MVP)

## Account
- Sign up / Login
- Private profile

## Content
- Posts
- Photos
- Videos
- Stories
- Captions
- Personal timeline
- Edit / Delete

## Publishing
- Publish a single post
- Publish selected posts as a journey
- Make the whole profile public
- Schedule publication
- Public share link

Before publication, visitors see:

> This page will become public on <date>.

---

# Example Use Cases

## Solo Trip
Document a 60-day Himalayan journey privately, then publish it after returning.

## Startup Journey
Record daily wins and failures privately. Publish the complete story at launch.

## Weight Loss
Track progress privately and reveal the journey only when comfortable.

## Exam Preparation
Keep a private log during months of study. Share afterward if desired.

---

# Positioning

Instagram:
- Share while living.

Solus:
- Live while documenting.
- Share only if you choose.

---

# Marketing

## Positioning

The first social platform built for solitude.

## Messaging

- Leave everyone. Don't leave yourself.
- What if social media wasn't social?
- A place to discover yourself.
- Live first. Share later.

## Viral Loop

Users publish completed journeys instead of individual posts.

Examples:
- "180 Days in the Himalayas"
- "Building My Startup from Scratch"
- "365 Days Without Social Media"

Every published journey has a shareable page.

---

# Future (Optional)

- Journey covers
- Export timeline as PDF
- Export as website
- Personal backup

Keep these out of the MVP.

---

# Non-Goals

- Competing with Instagram
- Endless scrolling
- Trending content
- Influencer economy
- Engagement optimization

---

# Success

A successful user isn't the one who spends the most time in Solus.

It's the one who builds a timeline they genuinely value years later.

---

# One-Line Pitch

**Solus is a private-first social platform where you document your life for yourself and choose to share your story only when you're ready.**

# Solus Design System
Version: 1.0

> Design Philosophy:
> Calm. Intentional. Minimal. Human.
>
> Solus should never feel like Instagram, Facebook or Twitter.
> It should feel like opening a personal journal.

---

# Brand

Name

Solus

Meaning

From Latin:
"Alone"

Not lonely.

Intentionally alone.

---

# Brand Values

Privacy

Presence

Calm

Reflection

Authenticity

Simplicity

---

# Emotional Goal

Every screen should make the user slower.

Never excite.

Never overwhelm.

Never manipulate.

The feeling after opening Solus should be

"I can breathe."

---

# Core Design Principles

## 1. Content First

UI disappears.

Content becomes the hero.

---

## 2. White Space Wins

Always prefer

more spacing

instead of

more components.

---

## 3. One Primary Action

Every screen

has one clear action.

Not five.

---

## 4. No Attention Economy

No red badges

No unread counters

No streak pressure

No "You missed"

No dopamine hacks

---

## 5. Familiar Yet Different

Users should instantly understand

how to use the app.

But emotionally

it should feel different.

---

# Color System

Primary

#0F172A

Slate 900

---

Background

#FFFFFF

Surface

#FAFAFA

Card

#FFFFFF

Border

#E5E7EB

---

Text

Primary

#111827

Secondary

#6B7280

Muted

#9CA3AF

---

Accent

Soft Blue

#3B82F6

Use only

for actions.

---

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

---

Never use

bright gradients

neon colors

gaming aesthetics

---

# Dark Theme

Background

#09090B

Card

#18181B

Border

#27272A

Text

#FAFAFA

Muted

#A1A1AA

Accent

#60A5FA

---

# Typography

Primary Font

Geist

Alternative

Inter

Serif Font

Lora (used for headings, reflections, and autobiography entries)

---

Font Scale

12

14

16

18

20

24

30

36

48

Never invent sizes.

---

Weights

400

500

600

700

---

Headings

Bold

Body

Regular

---

Line Height

150%

Headings

120%

---

Never justify text.

Always left align.

---

# Spacing

Base Unit

4px

Spacing

4

8

12

16

20

24

32

40

48

64

96

---

Padding

Cards

24px

Mobile

16px

Desktop

24px

---

# Radius

Buttons

12px

Cards

20px

Inputs

14px

Dialogs

24px

Images

24px

---

# Shadows

Only three.

Small

Medium

Large

Never more.

Avoid dramatic shadows.

---

# Layout

Content Width

760px

Reading Width

680px

App Page Width

640px (optimized for single-column reading and personal reflection)

Maximum

960px

Everything centered.

---

# Grid

12 Columns

Desktop

4 Columns

Tablet

2 Columns

Mobile

---

# Motion

Duration

150ms

200ms

300ms

Never longer.

---

Easing

ease-out

only.

---

Animations

Fade

Scale

Slide

Nothing else.

---

Never bounce.

Never shake.

Never flashy.

---

# Icons

Lucide

Stroke

1.75

Size

16

20

24

32

---

# Buttons

Primary

Filled

Secondary

Outline

Ghost

Text only

Danger

Red

Maximum

Four variants.

---

Button Height

44px

Minimum

Touch Target

44x44

---

# Inputs

Height

48px

Radius

14px

Label above

Never floating labels.

---

# Cards

Padding

24

Radius

20

Gap

16

Background

White

Minimal borders.

---

# Avatar

32

40

48

64

96

---

# Images

Rounded

Lazy loaded

Aspect ratios

1:1

4:5

16:9

---

# Navigation

Bottom Navigation

Mobile

Home

Timeline

+

Stories

Profile

---

Desktop

Sidebar

No top navbar

---

# Home Screen

Top

Greeting

Good Morning.

Small subtitle (date)

Below

Stories Carousel: Horizontal row showing "Your Story" (to capture new moments) and active stories inside gradient borders (Instagram style), clicking opens a 5-second auto-advancing fullscreen viewer.

Reflection Prompt (Apple Journal style card to quickly write reflections)

Then

Timeline Feed: Vertical chronological feed of large cards (Instagram style list).

---

# Timeline

Large cards

Lots of spacing

Readable captions

Minimal chrome

---

# Stories

Horizontal carousel at the top of the feed page.

Large circles

Soft border / Colored ring gradients for active stories.

No viewer count

No seen count

No reactions

Auto-advancing progress bar indicator at the top during fullscreen views.

Tap left/right hotspots to navigate.

---

# Post Design

Instagram-style layout:
- User profile header (avatar, name, location, actions dots menu).
- Photo/video media container with double-tap support (triggers a visual heart pop animation and reflects/bookmarks the post).
- Action row containing the reflect/bookmark trigger, export button, and date indicator.
- Caption block with bold username prepending the text and collapsible "more" truncation.

No likes counters.

No public comments section.

No public shares.

---

# Empty States

Illustration

One sentence

One CTA

Example

"You haven't captured today yet."

---

# Loading

Skeletons

No spinners

Whenever possible.

---

# Error Pages

Friendly

Minimal

Explain

Recover

---

# Haptics

Only

Success

Delete confirmation

Publish

Nothing else.

---

# Accessibility

Minimum

44px targets

AA contrast

Keyboard navigation

Screen reader labels

Visible focus

Always.

---

# Responsive

Mobile First

320px

375

390

768

1024

1280

1536

---

# Design Tokens

Radius

--radius-lg

Spacing

--space-4

Colors

--primary

Typography

--font-body

Everything tokenized.

---

# Microinteractions

Post saved

Tiny fade

Story uploaded

Tiny progress

Publish

Gentle success animation

Never confetti.

---

# Sound

Off by default.

No unnecessary sounds.

---

# UX Principles

Every interaction should answer:

Can this be simpler?

Can this require fewer taps?

Can this feel calmer?

---

# User Flow

Open App

↓

Timeline

↓

Create Memory

↓

Save

↓

Continue Living

No interruptions.

---

# Pixel Perfect Rules

• 8pt spacing grid
• Optical alignment over mathematical alignment
• Icons aligned to text baseline
• Never place two different border radii in the same component
• Keep vertical rhythm consistent
• Maximum 3 text sizes per screen
• Maximum 2 accent colors
• One primary CTA per screen
• Never exceed 3 levels of visual hierarchy
• No element should exist without a purpose

---

# Design Inspiration

Not Instagram.

Not Facebook.

Closer to:

- Apple Journal
- Apple Photos Memories
- Notion
- Arc Browser
- Linear
- Raycast
- Day One
- Minimal iOS system apps

---

# Design North Star

If a screen feels busy,

remove something.

If it still feels busy,

remove another thing.

The best interface for Solus is the one that quietly gets out of the user's way and lets their memories become the focus.

---

For Solus, every design decision should make the app feel **quieter**. Most apps try to increase stimulation; Solus should reduce it. The best microinteractions are almost invisible—you notice them because they feel natural, not because they're flashy.

---

# Typography

## Primary Font

**Geist** (my first choice)

* Modern
* Neutral
* Excellent readability
* Designed for digital interfaces
* Works beautifully with minimal UIs

## Alternatives

* **Inter** (safe, industry standard)
* **Manrope** (slightly warmer)
* **SF Pro Display/Text** (Apple platforms)
* **Instrument Sans** (more editorial feel)

For journaling, consider using a second font only for long-form entries:

* Newsreader
* Literata
* Source Serif 4

This creates a subtle distinction between interface chrome and personal writing.

---

# Colors

Avoid pure black.

Instead use:

```
Background
#FCFCFC

Card
#FFFFFF

Primary
#171717

Secondary
#737373

Border
#ECECEC

Accent
#2563EB

Success
#16A34A
```

Use color sparingly so memories—not the interface—stand out.

---

# Microinteractions

## Save

Tap **Save**

The button shrinks slightly (98%), then returns to full size with a tiny checkmark that fades in and out.

Duration: 180 ms.

---

## Story Uploaded

Instead of a toast:

```
✓ Saved
```

A slim progress line fills beneath the story thumbnail.

---

## Timeline

As the user scrolls, posts gently fade in and move upward by about 8 px.

No dramatic motion.

---

## Creating a Post

The composer expands from the bottom smoothly instead of appearing abruptly.

---

## Delete

Card scales to 97%.

Opacity decreases.

Slides away.

Nothing explodes or spins.

---

## Pull to Refresh

Instead of a spinner:

A thin circular ring slowly rotates.

Very subtle.

---

## Opening a Memory

The image grows from its thumbnail into full screen using a shared-element transition.

It feels like opening a memory rather than a new page.

---

## Long Press

Long-pressing a post slightly lifts it with a soft shadow before showing actions.

---

## Profile

Profile Details (avatar on the left, user metadata, and statistics grid for memories and journeys on the right).

Tabs Switching Layout (Grid View and Feed View tabs, styled as monospaced buttons with accent line indicators):
- Grid: shows 3-column square photo thumbnail gallery.
- Feed: shows standard chronological list of PostCards.

---

# Sounds

None by default.

Optional gentle haptic feedback on supported devices.

---

# Haptics

Only for meaningful actions:

* Save
* Publish
* Delete
* Restore

Never on every tap.

---

# Empty States

Instead of:

```
No posts
```

Use:

> Your story starts today.

or

> Quiet is a beautiful place to begin.

---

# Loading

Skeletons only.

Avoid spinners whenever possible.

---

# Animations

Use only:

* Fade
* Scale
* Slide

Avoid:

* Bounce
* Flip
* Elastic
* Shake
* Rotation (except tiny loading indicators)

---

# Cards

Large radius:

20–24 px

Lots of whitespace.

One image.

One caption.

One date.

Nothing else.

---

# Timeline

Instead of showing exact timestamps everywhere, use softer labels:

```
Today

Yesterday

This Week

June 2026

2025

Childhood
```

It makes the timeline feel like chapters of a life rather than a database.

---

# Visual Details

## Thin Borders

Instead of heavy shadows:

```
1px border

rgba(0,0,0,.06)
```

This feels cleaner.

---

## Frosted Blur

Use only for:

* Bottom navigation
* Floating action button

Keep it subtle.

---

## Rounded Images

24 px radius.

Feels friendlier than sharp corners.

---

# Navigation

Bottom bar:

```
🏠

📖

➕

🕒

👤
```

Keep labels small.

---

# Floating Action Button

A soft circular button.

When scrolling down:

Shrink to icon only.

When scrolling up:

Expand again.

---

# Nice Details

## On This Day

Once per day:

> Two years ago today...

Just one memory.

No endless nostalgia feed.

---

## Memory Counter

Instead of:

```
126 posts
```

Show:

```
126 memories
```

Small wording changes reinforce the product philosophy.

---

## Writing Prompt

A gentle prompt beneath the composer, rotating daily:

* What made today memorable?
* What surprised you?
* What made you smile?
* What did you learn?
* What are you grateful for?

Never require a response.

---

## Weather (Optional)

Attach weather automatically if the user opts in.

```
☀️ 28°C
```

People often enjoy remembering the context of a day.

---

## Location

Keep it subtle.

```
📍 Manali
```

Never display maps unless the user asks.

---

## Memory Timeline

A thin vertical line connecting entries creates the feeling of a life unfolding over time.

---

## Tiny Calendar Heatmap

Inspired by GitHub.

Each day becomes a small dot.

Tap a dot to revisit that day's memories.

---

## Publish Animation

When a private journey becomes public:

The lock icon softly transforms into a globe over 300 ms.

No fireworks.

No celebration.

Just a quiet transition.

---

# Design Inspirations

* Apple Journal
* Apple Photos Memories
* Arc Browser
* Linear
* Day One
* Notion
* Bear Notes
* Read.cv (archived)
* Minimal Camera apps

---

# Things to Avoid

* Notification badges
* Infinite red dots
* Auto-playing videos
* Trending pages
* Stories with view counts
* Confetti
* Gamification
* Pop-ups asking users to invite friends
* Streaks
* Engagement reminders
* "People you may know"

---

# One Idea I'd Add

Instead of opening to a traditional feed, open to a **Today** screen:

```
Good evening.

July 10, 2026

You captured one memory today.

[ Continue your story ]
```

It immediately signals that Solus is about **your life**, not everyone else's. That small shift can make the app feel calmer and more intentional from the very first screen.
