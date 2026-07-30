# Nipun Gujarat — Student Observation & Review Portal

A frontend-only, static-data prototype of a Government of Gujarat student
review portal for teachers and admins — built with React, Vite, Tailwind CSS,
Framer Motion, Lucide icons, React Router and Recharts.

This is UI-first: all data (schools, teachers, students, verifiers, reviews)
is mock data living in `src/data/mockData.js`. There is no backend — review
submissions are kept in memory (and persisted to `localStorage` so they
survive a page refresh) purely for demo purposes.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Logging in

The login screen is a demo — pick **Teacher Login** or **Admin Login**,
choose any Teacher ID from the dropdown (or any username for Admin), type
anything into the password field, and submit.

## What's inside

- **Landing page** — animated hero with a Gujarat government school
  illustration, sun/clouds/birds, kids waving, feature cards and footer.
- **Login page** — split-screen layout with animated school illustration
  and a teacher/admin toggle.
- **Teacher dashboard** — teacher profile card, stats, and students grouped
  by class (Balvatika–Std 5) in searchable/filterable accordions.
- **Student review screen** — Bad / Average / Good assessment cards with
  hover/selection animations, remarks, and a confetti celebration on submit.
- **Completed reviews** — searchable, filterable, paginated review history
  (teacher and admin views).
- **Admin dashboard** — state-wide stats, pie/line/bar charts (Recharts),
  and progress bars for districts, blocks and schools.
- **School management** — expandable District → Block → Cluster → School →
  Teacher tree, with a "View Reviews" action per teacher.
- **Verifier management** — table with add/edit/delete and a floating
  action button.

## Tech stack

React 19, Vite, Tailwind CSS 3, Framer Motion, Lucide Icons, React Router 7,
Recharts, canvas-confetti.
