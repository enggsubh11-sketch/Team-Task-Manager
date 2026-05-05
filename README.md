# Team Task Manager

Full-stack task management application with:
- React + Vite frontend
- Node.js + Express backend
- MongoDB database

## Project Structure

- `frontend/` - React client application
- `backend/` - Express API server

## Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB (local or cloud connection string)

## Quick Start

1. Install dependencies:
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
2. Configure backend environment variables (see `backend/README.md`).
3. Run backend:
   - `cd backend`
   - `npm run dev`
4. Run frontend in a new terminal:
   - `cd frontend`
   - `npm run dev`

Frontend default URL: `http://localhost:5173`  
Backend default URL: `http://localhost:5000`

## Available Scripts

### Backend
- `npm run dev` - Run server with nodemon
- `npm start` - Run server with Node.js

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build production assets
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Base URL

The frontend API client uses:
- `http://localhost:5000/api`

If you deploy the backend elsewhere, update `frontend/src/api/client.js`.
