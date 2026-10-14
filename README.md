# Chirag Chhirauliya Portfolio

A premium 3D portfolio built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and React Three Fiber.

## Features

- Interactive 3D hero scene
- Responsive portfolio sections
- Live GitHub API integration via backend proxy
- LeetCode statistics or fallback messaging
- Local resume download and Drive fallback
- Contact form with validation and optional email backend
- Automated tests for core rendering behavior

## Local setup

1. Install dependencies:
   npm install
2. Copy environment variables:
   cp .env.example .env
3. Start the frontend and backend together:
   npm run dev:all
4. Open http://localhost:5173

## Commands

- Frontend only: npm run dev
- Backend only: npm run dev:server
- Build: npm run build
- Test: npm run test:run
- Lint: npm run lint

## Environment variables

See [.env.example](.env.example) for the required configuration.

The contact form will work only after setting EMAIL_HOST, EMAIL_USER, and EMAIL_PASS. If those values are absent, the form returns a helpful setup message and the page offers a mailto fallback.

## Asset note

The profile image and resume were verified and saved locally in public/images and public/resume when the remote files were accessible. If Drive permissions change, the fallback links in the website continue to work.
