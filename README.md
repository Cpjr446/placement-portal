# Placement Portal

Placement portal is a dynamic job tracker application which allows recruiters to post jobs, applicants to upload their resume, get feedback and apply to multiple jobs. 
Portal admin can get the statistics of applicants placed, domains, average and median package.

## Features
- Applicant Authentication (Login/Register)
- Job Dashboard
- Premium UI with Dark Mode

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
