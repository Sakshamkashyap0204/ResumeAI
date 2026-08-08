# 🤖 ResumeAI — AI-Powered Resume Analyzer

A full-stack MERN application that analyzes your resume against any job role using Groq AI, gives you a match score, skill gap analysis, strengths/weaknesses, improvement suggestions, a learning roadmap, and live job listings — all in one place.

---

## ✨ Features

- 📄 **PDF Resume Upload** — extracts text from your resume automatically
- 🎯 **Job Role Matching** — 70+ predefined roles across Tech, Design, Finance, HR, Marketing, Sales, Healthcare, Legal, and more
- 📊 **Match Score** — accurate skill-by-skill comparison (not AI-guessed)
- ✅ **Skills You Have vs Skills to Acquire** — role-specific, not generic
- 💪 **Strengths & Weaknesses** — AI-generated, honest assessment
- ✏️ **Resume Improvement Suggestions** — actionable, specific to your resume
- 🗺️ **Learning Roadmap** — step-by-step plan to close skill gaps
- 💼 **Live Job Listings** — direct links to LinkedIn, Naukri, Indeed, Unstop, Glassdoor, Internshala, Wellfound, Shine
- 🔐 **JWT Auth** — signup, login, email OTP verification
- 📱 **Fully Responsive** — works on mobile and desktop

---

## 🛠️ Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS            |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB (local or Atlas)                |
| AI        | Groq API (`llama-3.3-70b-versatile`)    |
| Auth      | JWT + bcrypt                            |
| Email     | Nodemailer (Gmail SMTP)                 |
| PDF Parse | pdf-parse                               |

---

## 📁 Project Structure

```
AI resume/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/             # Axios instance + all API calls
│   │   ├── components/      # Navbar, MatchCircle, SkillBadge, ProtectedRoute
│   │   ├── context/         # AuthContext
│   │   ├── data/            # jobRoles.js (70+ roles with skills)
│   │   ├── pages/           # AuthPage, Dashboard, UploadPage, ResultsPage
│   │   └── index.css        # Animations, skeleton shimmer
│   ├── .env.example
│   └── vite.config.js
│
├── server/                  # Node.js + Express backend
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # auth, resume, analysis controllers
│   ├── middleware/          # JWT auth, error handler, multer upload
│   ├── models/              # User, Resume, AnalysisResult schemas
│   ├── routes/              # authRoutes, resumeRoutes, resultRoutes
│   ├── services/            # aiService (Groq), pdfService, emailService
│   ├── uploads/             # PDF uploads (git-ignored)
│   └── .env.example
│
├── .gitignore
├── package.json             # Root scripts
└── render.yaml              # Render deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local) or MongoDB Atlas URI
- Groq API key — get one free at [console.groq.com](https://console.groq.com)
- Gmail account with an **App Password** (not your real password)

---

### 1. Clone the repository

```bash
git clone https://github.com/Sakshamkashyap0204/ResumeAI.git
cd ResumeAI
```

---

### 2. Setup the Backend

```bash
cd server
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Fill in `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-resume
JWT_SECRET=any_long_random_string_here
JWT_EXPIRES_IN=7d

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

GROQ_API_KEY=gsk_your_groq_api_key_here

CLIENT_URL=http://localhost:5173
```

> **How to get a Gmail App Password:**
> Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

Start the backend:

```bash
node index.js
```

Server runs at `http://localhost:5000`

---

### 3. Setup the Frontend

```bash
cd ../client
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Fill in `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

### 4. Run Both Together (from root)

```bash
# Install root dependencies
npm install

# Run both frontend and backend concurrently
npm run dev
```

---

## 🔑 Environment Variables Reference

### `server/.env`

| Variable       | Description                              |
|----------------|------------------------------------------|
| `PORT`         | Backend port (default: 5000)             |
| `MONGO_URI`    | MongoDB connection string                |
| `JWT_SECRET`   | Secret key for JWT signing               |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`)              |
| `EMAIL_USER`   | Gmail address for OTP emails            |
| `EMAIL_PASS`   | Gmail App Password (16-char, no spaces) |
| `GROQ_API_KEY` | Groq API key (`gsk_...`)                |
| `CLIENT_URL`   | Frontend URL for CORS                   |

### `client/.env`

| Variable        | Description              |
|-----------------|--------------------------|
| `VITE_API_URL`  | Backend API base URL     |

---

## 📸 Screenshots

> Dashboard → Upload Resume → Select Role & Experience → AI Analysis → Results with 6 tabs

---

## 🌐 Deployment

### Deploy frontend and backend on Render

This repository includes `render.yaml`, which creates both services:

- `ai-resume-analyzer-api` — the Node/Express backend
- `ai-resume-analyzer-web` — the React static frontend

Before deploying, create a free MongoDB Atlas database and copy its connection string. In Atlas, allow access from anywhere (`0.0.0.0/0`) for this beginner deployment.

Then:

1. Sign in at [Render](https://render.com) with GitHub.
2. Click **New** → **Blueprint**, select this repository, and click **Apply**.
3. When Render requests the backend secrets, enter `MONGO_URI`, `EMAIL_USER`, `EMAIL_PASS` (a Gmail App Password), and `GROQ_API_KEY`. Do not enter these values in GitHub.
4. Wait for both services to finish deploying, then open the `ai-resume-analyzer-web` URL.

The local project continues to work after deployment. Keep `client/.env` set to `VITE_API_URL=http://localhost:5000/api`, start MongoDB, then run the server and client as described above.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 👤 Author

**Saksham Kashyap**
- GitHub: [@Sakshamkashyap0204](https://github.com/Sakshamkashyap0204)
