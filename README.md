# Digital Heroes — Lead Generation Platform

A full-stack lead generation and management web application built with the MERN stack.

## Architecture

```
root/
├── client/          # Vite + React + Tailwind CSS frontend
└── server/          # Express.js + MongoDB backend
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd server
cp .env.example .env     # Edit with your MongoDB URI & JWT secret
npm install
npm run dev              # Starts on http://localhost:5000
```

The server auto-seeds a default admin account on first run:
- **Username:** `admin`
- **Password:** `Admin@123`

### 2. Frontend Setup

```bash
cd client
cp .env.example .env     # Edit API URL if needed
npm install
npm run dev              # Starts on http://localhost:5173
```

## Features

### Public
- Modern SaaS landing page with lead capture form
- Client-side form validation (React Hook Form)
- Success/error toast notifications

### Admin Dashboard
- JWT-based authentication
- View all leads with search & status filters
- Update lead status (New → Contacted → Closed)
- Delete leads
- Dashboard statistics

## API Endpoints

| Method | Endpoint                 | Auth | Description               |
|--------|--------------------------|------|---------------------------|
| POST   | `/api/auth/login`        | No   | Admin login, returns JWT  |
| POST   | `/api/auth/logout`       | No   | Clears auth cookie        |
| GET    | `/api/auth/me`           | Yes  | Get current admin info    |
| POST   | `/api/leads`             | No   | Submit a new lead         |
| GET    | `/api/leads`             | Yes  | List leads (search/filter)|
| PATCH  | `/api/leads/:id/status`  | Yes  | Update lead status        |
| DELETE | `/api/leads/:id`         | Yes  | Delete a lead             |

## Deployment

### Frontend (Vercel)
1. Import the `client` folder as a Vercel project
2. Set environment variable: `VITE_API_URL` = your deployed backend URL + `/api`
3. Build command: `npm run build`
4. Output directory: `dist`

### Backend (Render)
1. Create a new Web Service pointing to the `server` folder
2. Build command: `npm install`
3. Start command: `node server.js`
4. Set environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong random string
   - `CLIENT_URL` — your Vercel frontend URL
   - `NODE_ENV` — `production`

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Hook Form, Axios, Lucide React, React Hot Toast
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, express-validator
