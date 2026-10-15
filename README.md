# Chirag Chhirauliya Portfolio

A premium 3D portfolio built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and React Three Fiber.

## Features

- Interactive 3D hero scene
- Responsive portfolio sections
- GitHub and LeetCode profile links
- Local resume download and Drive fallback
- Contact form with frontend validation and a prefilled email-app handoff
- Automated tests for core rendering behavior

## Local setup

1. Install dependencies:
   npm install
2. Start the frontend:
   npm run dev
3. Open http://localhost:5173

## Commands

- Development server: npm run dev
- Build: npm run build
- Test: npm run test:run
- Lint: npm run lint

The app has no backend or environment-variable requirements. Contact form submission validates locally and opens a prefilled draft in the visitor's email app; the visitor sends it from there.

## Asset note

The profile image and resume were verified and saved locally in public/images and public/resume when the remote files were accessible. If Drive permissions change, the fallback links in the website continue to work.
