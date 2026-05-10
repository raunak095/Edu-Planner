<div align="center">

# 🎓 EduPlanner

### *Your personalized academic roadmap, engineered.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

---

*A smart study planner that transforms your subjects, time, and goals into a structured, day-by-day roadmap — built as a full-stack college prototype by Team Idea Catalysts.*

</div>

---

## 📖 What is EduPlanner?

EduPlanner is a web application designed to help students stop guessing and start planning. Instead of wondering *"what do I study today?"*, EduPlanner takes your subject, the days you have left, and your difficulty preference — and generates a prioritized, topic-by-topic study schedule tailored just for you.

Beyond roadmap generation, EduPlanner is a complete academic companion: track your progress, manage your subjects, access teacher-uploaded resources, and stay on top of announcements — all from a single, clean dashboard.

---

## ✨ Features

### 👩‍🎓 For Students
- **🗺️ Smart Roadmap Generation** — Input a subject and days remaining; get a day-wise study plan sorted by topic priority and exam frequency
- **📚 Subject Manager** — Add, edit, delete, and mark subjects as complete, with search and filter support
- **📊 Progress Tracking** — Visual progress bars and completion percentages update in real-time
- **📈 Study Analytics** — Weekly study hour charts powered by Recharts
- **📢 Announcements** — Stay informed with teacher and admin posts

### 👨‍🏫 For Teachers
- **📤 Resource Upload** — Share PDFs, links, videos, and notes tagged to specific topics
- **🏷️ Topic Tagging** — Assign priority levels to topics to influence roadmap generation
- **📢 Post Announcements** — Communicate updates directly to students

### 🛠️ For Admins
- **👥 User Management** — View and manage students and teachers
- **⚙️ System Control** — Oversee platform settings and data integrity

### 🔐 Authentication & Security
- **OTP Email Verification** — New users verify their account via a 6-digit OTP sent to their inbox
- **JWT-based Auth** — Secure, stateless authentication with role-based route protection
- **bcrypt Password Hashing** — Passwords are never stored in plain text
- **Protected Routes** — Frontend guards prevent unauthorized access based on user role

---

## 🏗️ Architecture Overview

```
EduPlanner/
├── frontend/               # React (Vite) SPA
│   └── src/
│       ├── pages/          # Route-level components (Dashboard, Roadmap, Subjects…)
│       ├── components/     # Reusable UI (Navbar, Sidebar, DarkModeToggle)
│       ├── layouts/        # DashboardLayout wrapper
│       ├── utils/          # ProtectedRoute, helpers
│       ├── styles/         # Global and auth-specific CSS
│       └── api.js          # Axios instance (baseURL: localhost:5000/api)
│
└── backend/                # Node.js + Express REST API
    └── src/
        ├── app.js          # Entry point, middleware, route registration
        ├── config/
        │   └── db.js       # MongoDB connection via Mongoose
        ├── models/         # Mongoose schemas
        │   ├── User.js
        │   ├── Topic.js
        │   ├── Roadmap.js
        │   ├── Resource.js
        │   └── File.js
        ├── controllers/    # Business logic
        │   ├── authController.js
        │   ├── roadmapController.js
        │   ├── topicController.js
        │   ├── resourceController.js
        │   └── fileController.js
        ├── routes/         # Express routers
        ├── middleware/     # JWT auth guard, Multer upload handler
        └── seedTopics.js   # Pre-seeds DBMS & DSA topic data
```

---

## 🧠 The Roadmap Engine

The heart of EduPlanner is its **roadmap generation algorithm**, living in `roadmapController.js`.

Here's how it works:

1. **Input** — Subject name, days remaining, difficulty level (`easy` / `medium` / `hard`)
2. **Topic Fetch** — Retrieves all topics for the subject from MongoDB
3. **Priority Sorting** — Topics are sorted by `priorityScore` (a composite metric combining exam frequency, difficulty, and teacher-assigned importance) — highest priority first
4. **Day Planning** — Topics are distributed across days based on available study hours:
   - `easy` → 2 hours/day
   - `medium` → 4 hours/day
   - `hard` → 6 hours/day
5. **Persistence** — The generated roadmap is saved to the `Roadmap` collection and linked to the student's user ID
6. **Output** — A structured day-wise plan returned to the frontend for display and checkbox-based tracking

> Topics that exceed a day's remaining hours are deferred to the next day, ensuring the plan is always realistic.

---

## 🗄️ Data Models

| Model | Key Fields |
|-------|-----------|
| `User` | name, email, password (hashed), role, OTP fields, isVerified |
| `Topic` | subject, name, basePriority, priorityScore, examFrequency, difficulty, estimatedHours |
| `Roadmap` | userId, subject, daysLeft, difficulty, plan[ {day, topics[]} ], progress |
| `Resource` | teacherId, subject, topicId, title, link, type, isApproved, relevanceScore |
| `File` | fileName, fileData (Buffer), mimeType, fileSize, uploadedBy, role |

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register + send OTP | Public |
| `POST` | `/api/auth/verify-otp` | Verify OTP, activate account | Public |
| `POST` | `/api/auth/login` | Login, receive JWT | Public |
| `GET` | `/api/auth/profile` | Get current user info | 🔒 JWT |

### Roadmap
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/roadmap/generate-roadmap` | Generate a new study roadmap | 🔒 JWT |
| `GET` | `/api/roadmap/my-roadmap` | Fetch user's saved roadmaps | 🔒 JWT |

### Topics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/topics/:subject` | Get topics for a subject | 🔒 JWT |
| `POST` | `/api/topics/` | Create a topic (teacher/admin) | 🔒 JWT |

### Resources
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/resources` | Add a resource (teacher/admin) | 🔒 JWT |
| `GET` | `/api/resources/:subject` | Get approved resources | 🔒 JWT |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/files/upload` | Upload a file (PDF/DOCX/TXT, max 3MB) |
| `GET` | `/api/files/` | List all files (metadata only) |
| `GET` | `/api/files/download/:id` | Download a file |
| `GET` | `/api/files/preview/:id` | Preview a file in browser |
| `DELETE` | `/api/files/:id` | Delete a file |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- MongoDB Atlas URI (or local MongoDB)
- Gmail account for OTP email (with App Password enabled)

### 1. Clone the Repository
```bash
git clone https://github.com/zephyrzip/Edu-Planner.git
cd eduplanner
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Start the backend:
```bash
npm run dev
```

### 3. Seed Default Topics
```bash
# From inside /backend
node seedTopics.js
```

This populates MongoDB with **22 pre-built topics** for DBMS and DSA — ready for roadmap generation immediately.

### 4. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🎨 UI Highlights

- **Dark / Light Mode** — Persistent theme toggle, stored in `localStorage`, applied globally via body class
- **Glassmorphism Design** — Frosted-glass cards with backdrop blur and translucent backgrounds
- **Fixed Navbar + Sidebar** — Always-visible navigation with smooth hover transitions
- **Recharts Integration** — Weekly study hour bar charts in the student dashboard
- **Animated Entry** — Fade-in animations on auth pages for a polished feel
- **Responsive Layout** — Sidebar + main content grid adapts cleanly across screen sizes

---

## 👥 Team — Idea Catalysts

| Member | Role | Contributions |
|--------|------|---------------|
| **Sounak Biswas** | Backend Developer | Express setup, MongoDB, full auth system (JWT/OTP/bcrypt), roadmap engine, all API routes, database models, seed script |
| **Raunak Dasgupta** | Frontend Developer | Project setup, routing, auth UI, dashboard, charts, progress tracking, roadmap display, UI/UX design |
| **Tathagata Ghoshray** | Backend QA | Code review, file upload backend component, auth controller refinement, backend testing |
| **Sayanti Sarkar** | Documentation & QA | README, frontend testing, demo data setup |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
Copyright (c) 2026 Sounak Biswas
```

---

<div align="center">

*Built with 💜 by Team Idea Catalysts — 2nd Year CSE, Semester 4*

</div>
