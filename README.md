# Placement Portal

A dynamic job board application built with the MERN stack.

## Prerequisites
- Node.js (v18+)
- MongoDB (running locally or set MONGO_URI in server/.env)

## Setup

1. **Server Setup**
   ```bash
   cd server
   npm install
   # Seed the database (optional, runs once)
   node seed.js
   # Start the server
   node index.js
   ```

2. **Client Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Features
- Applicant Authentication (Login/Register)
- Job Dashboard
- Premium UI with Dark Mode
