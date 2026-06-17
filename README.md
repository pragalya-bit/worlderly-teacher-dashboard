# Worlderly · Coach (Teacher) Dashboard

A standalone React mockup of the **teacher / coach** side of Worlderly, built to
match the student dashboard's theme (cream `#FDF8F4` + orange `#F97316`,
Quicksand font, Font Awesome icons, soft white rounded cards).

## Run it

```bash
npm install
npm run dev
```

Opens at http://localhost:5174. All data is dummy/simulated (see `src/data.js`).

## What a coach can do here

| Section | What it does |
|---|---|
| **Today** | Greeting, key stats, the live/next class, today's class timeline, "needs attention" (checkpoints to grade + students falling behind), week-at-a-glance. |
| **Schedule** | Week board of all 1:1 and group classes, colour-coded by subject. |
| **My Students** | Roster with each student's *trek* progress (week, %, last quiz, streak), filterable. |
| **Checkpoints** | Grading queue — review assignment/worksheet/quiz submissions, give a score + feedback. |
| **Lesson Plans** | Expert-made plans (no prep) — present or download. |
| **Messages** | Chat with students & parents (working reply box). |
| **Earnings** | Monthly payout, per-class rate, 6-month history chart. |
| **Settings** | Profile, teaching availability, notifications. |

## Stack

- React 19 + Vite (plain `.jsx`, no TypeScript)
- Tailwind via Play CDN + Quicksand + Font Awesome 6 (loaded in `index.html`)

No build config needed — it's a self-contained demo.

## Structure

```
src/
  main.jsx            app entry
  App.jsx             shell: sidebar + top bar + mobile nav + panel switch
  data.js             all dummy data
  components/
    Sidebar.jsx
    Dashboard.jsx     "Today"
    Schedule.jsx
    Students.jsx
    Checkpoints.jsx
    Lessons.jsx
    Messages.jsx
    Earnings.jsx
    Settings.jsx
```
