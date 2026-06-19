# 🍽️ Hostel Food Quality Tracker

A full-stack MERN application that lets hostel students rate meals, submit complaints, and track food quality, while giving mess managers and admins the tools to manage menus, respond to feedback, and monitor performance — with AI-powered complaint categorization, automated quality scoring, and email notifications built in.

---

## ✨ Features

### 👨‍🎓 Student
- Register and log in
- View the daily menu (breakfast, lunch, dinner)
- Rate each meal 1–5 stars
- Submit complaints — optionally anonymous, automatically categorized by AI
- Mark daily attendance per meal (feeds food wastage estimates)
- Scan a QR code at the mess entrance for instant feedback access

### 🍳 Mess Manager
- Log in with credentials created by an admin
- Create/update the daily menu (items, serving time, quantity prepared)
- View and reply to complaints, update their resolution status
- View daily quality scores and the monthly leaderboard
- Display a QR code for walk-in feedback

### 🛠️ Admin
- Auto-seeded on first server start (no manual setup needed)
- Dashboard with live stats: user counts, complaint breakdown by category, resolution rate, overall satisfaction
- Create, activate/deactivate, and delete student/mess-manager/admin accounts
- View quality scores and leaderboard insights

### 🤖 Advanced Features
- **AI Complaint Categorization** — every complaint is automatically classified into Taste, Hygiene, Quantity, Variety, or Service using Google's Gemini API
- **Food Quality Score** — a daily 0–100 score computed from average ratings, complaint volume, and resolution rate
- **Leaderboard** — best/worst-rated meals and monthly rating trends
- **Email Notifications** — welcome emails for new accounts, menu update alerts, and complaint-reply notifications, sent via Gmail SMTP
- **Attendance-Based Wastage Tracking** — compares food prepared vs. students who marked attendance to estimate daily wastage

---

## 🧱 Tech Stack

**Frontend:** React (Vite), Tailwind CSS v4, React Router, Axios, react-hot-toast, qrcode.react
**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT authentication, bcryptjs
**AI:** Google Gemini API (`gemini-2.5-flash-lite`) for complaint classification
**Email:** Nodemailer with Gmail SMTP

---

## 📁 Project Structure

```
hostel-food-tracker/
├── server/                          # Backend (Express API)
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection
│   │
│   ├── controllers/
│   │   ├── authController.js        # register, login, get current user
│   │   ├── menuController.js        # create/update menu, get today's/by-date menu
│   │   ├── ratingController.js      # submit rating, own history, daily summary
│   │   ├── complaintController.js   # submit (AI categorized), list, vote, reply
│   │   ├── adminController.js       # create/list/activate/delete users
│   │   ├── qualityScoreController.js# daily 0–100 quality score calculation
│   │   ├── leaderboardController.js # best/worst meals, monthly rating trend
│   │   ├── dashboardController.js   # consolidated admin stats
│   │   └── attendanceController.js  # mark attendance, wastage report
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js        # protect (JWT check) + authorize (role check)
│   │   └── errorMiddleware.js       # 404 handler + centralized error responses
│   │
│   ├── models/
│   │   ├── userModel.js             # student / mess_manager / admin, shared schema
│   │   ├── menuModel.js             # one doc per day, breakfast/lunch/dinner + qty
│   │   ├── ratingModel.js           # one rating per student per meal per day
│   │   ├── complaintModel.js        # description, category, status, votes, reply
│   │   └── attendanceModel.js       # one record per student per meal per day
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── ratingRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── adminRoutes.js           # all routes admin-only
│   │   ├── qualityScoreRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── attendanceRoutes.js
│   │
│   ├── utils/
│   │   ├── generateToken.js         # signs the JWT with id + role
│   │   └── sendEmail.js             # Nodemailer wrapper (Gmail SMTP)
│   │
│   ├── .env                         # backend secrets (not committed)
│   ├── .gitignore
│   ├── package.json
│   └── server.js                    # app entry point, route wiring, admin auto-seed
│
└── client/                          # Frontend (React + Vite)
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx   # blocks a route unless user has the right role
    │   │   └── Notification.jsx     # custom react-hot-toast card (notify helper)
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx      # user session, login/logout, backendUrl
    │   │
    │   ├── pages/
    │   │   ├── Login.jsx            # single login form for every role
    │   │   ├── Register.jsx         # student self-registration
    │   │   ├── Insights.jsx         # quality score + leaderboard (manager/admin)
    │   │   ├── QRCodeDisplay.jsx    # printable QR linking to the complaint page
    │   │   │
    │   │   ├── student/
    │   │   │   ├── StudentDashboard.jsx   # today's menu, star ratings, attendance
    │   │   │   └── SubmitComplaint.jsx    # complaint form (anonymous toggle)
    │   │   │
    │   │   ├── messManager/
    │   │   │   ├── MessManagerDashboard.jsx # menu editor (items/time/qty)
    │   │   │   └── ComplaintsInbox.jsx      # list, reply, update status
    │   │   │
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx       # stats grid + category breakdown
    │   │       └── AdminUsers.jsx           # create/list/activate/delete accounts
    │   │
    │   ├── App.jsx                  # all route definitions + ProtectedRoute wrapping
    │   ├── main.jsx                 # mounts BrowserRouter + AuthProvider
    │   └── index.css                # Tailwind import
    │
    ├── .env                         # VITE_BACKEND_URL (not committed)
    ├── vite.config.js               # Tailwind Vite plugin
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Google Gemini API key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))
- A Gmail account with an App Password for sending notification emails

### 1. Clone the repository
```bash
git clone https://github.com/learning-processs/hostel-food-tracker.git
cd hostel-food-tracker
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/` with the following variables:

```dotenv
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_long_random_secret
JWT_EXPIRE=30d

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose_a_password

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:
```bash
npm run dev
```

On first run, this automatically creates the admin account from `ADMIN_EMAIL`/`ADMIN_PASSWORD` — no manual database setup required.

### 3. Frontend setup
```bash
cd ../client
npm install
```

Create a `.env` file inside `client/`:

```dotenv
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 👥 How Roles Work

| Role | How the account is created | How they log in |
|------|------------------------------|------------------|
| **Admin** | Auto-created on first server start from `.env` | `/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| **Mess Manager** | Created by an admin via the admin panel (or `POST /api/admin/users`) | Same `/login` page, using the credentials the admin set |
| **Student** | Self-registers via `/register` | Same `/login` page |

There's only one login page for every role — after a successful login, the backend returns the user's `role`, and the frontend redirects to the matching dashboard.

---

## 🔌 API Reference

All endpoints are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/auth/register` | Public — always creates a student |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Logged-in user |

### Menu
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/menu` | Mess Manager — create/update a day's menu |
| GET | `/menu/today` | Logged-in user |
| GET | `/menu/:date` | Logged-in user (format: `YYYY-MM-DD`) |

### Ratings
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/ratings` | Student — rate a meal (upserts) |
| GET | `/ratings/me` | Student — own rating history |
| GET | `/ratings/summary/:date` | Mess Manager / Admin |

### Complaints
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/complaints` | Student — submit (AI auto-categorizes) |
| GET | `/complaints` | Mess Manager / Admin — anonymous ones are masked |
| GET | `/complaints/me` | Student — own complaints |
| PUT | `/complaints/:id/vote` | Logged-in user — toggle a vote |
| PUT | `/complaints/:id/reply` | Mess Manager — reply + update status |

### Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/admin/users` | Admin — create any role |
| GET | `/admin/users?role=` | Admin — list, optional role filter |
| PUT | `/admin/users/:id/status` | Admin — activate/deactivate |
| DELETE | `/admin/users/:id` | Admin |

### Quality Score & Leaderboard
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/quality-score/:date` | Mess Manager / Admin |
| GET | `/leaderboard/meals?month=&year=` | Mess Manager / Admin |
| GET | `/leaderboard/trend?month=&year=` | Mess Manager / Admin |

### Dashboard
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/dashboard` | Admin — consolidated stats |

### Attendance
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/attendance` | Student — mark attending/not attending |
| GET | `/attendance/wastage/:date` | Mess Manager / Admin |

---

## 🧠 How the Quality Score Is Calculated

```
ratingComponent   = (averageStars / 5) * 100
complaintPenalty  = min(complaintCount * 5, 50)
resolutionBonus   = (resolutionRate / 100) * 10

qualityScore = clamp(ratingComponent - complaintPenalty + resolutionBonus, 0, 100)
```

This rewards good ratings, penalizes unresolved complaints, and gives credit back for responsive complaint resolution.

---

## 🚀 Future Improvements
- Real image upload for complaint photos (currently accepts a `photoUrl` string)
- Redirect-after-login for the QR code flow (currently sends unauthenticated scans to `/login` first)
- Push notifications in addition to email
- Exportable PDF monthly reports

---

## 👤 Author
**Anu**
