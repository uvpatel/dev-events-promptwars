# EventFlow AI 🚀

A production-ready full-stack event management platform that uses AI insights and smart visualization to help attendees navigate venues efficiently, avoid crowds, and coordinate in real-time.

## Features

1. **Smart Venue Map:** Interactive map showing stages, booths, food stalls, and facilities using Google Maps API.
2. **Real-Time Crowd Density Visualization:** Color-coded zones (Green/Yellow/Red) showing live crowd levels.
3. **Queue Time Prediction:** AI-estimated waiting times for food stalls and counters.
4. **AI Event Assistant:** Google Gemini-powered chatbot that answers questions about schedules, locations, and crowd status.
5. **Personalized Event Planner:** Save sessions, bookmark booths, and view your custom schedule.
6. **Live Event Dashboard:** Overview of upcoming sessions, crowd status, and event announcements.
7. **Admin Panel:** Real-time crowd density overrides and session management.

## Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS 3 (Dark Theme, Glassmorphism)
- Framer Motion (Animations)
- React Google Maps API
- Firebase Authentication

### Backend
- Node.js + Express.js
- Google Gemini AI API (`gemini-2.0-flash`)
- In-memory data store with demo data (Firestore ready)
- Jest & Supertest (Testing)
- Docker (Containerization)

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install

# Set up environment variables
cp .env.example .env

# Run the development server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Set up environment variables
cp .env.example .env
# (Optional) Add your Google Maps API key to VITE_GOOGLE_MAPS_API_KEY in .env

# Run the development server
npm run dev
```

### 3. Demo Mode
The application is pre-configured to run in **Demo Mode** out of the box. 
- You don't need a Firebase configuration or a Google Maps API Key to see the UI.
- The backend will use simulated data for a demo "TechConf 2026" event.
- The AI chat will use fallback responses if no Gemini API key is provided.

## Data Models

Detailed data structures and mock data can be found in `backend/src/data/seedData.js`.

## API Documentation
Please see [API_DOCS.md](./API_DOCS.md) for full REST API specifications.

## Deployment (Google Cloud Run)

The backend includes a `Dockerfile` optimized for Google Cloud Run:

```bash
cd backend
docker build -t eventflow-backend .
# Deploy to Google Cloud Run
# gcloud run deploy eventflow-api --image eventflow-backend ...
```

The frontend can be built and deployed to Firebase Hosting or Google Cloud Storage:

```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```