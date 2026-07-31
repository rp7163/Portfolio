# Rudra Patel — Portfolio (MERN Stack)

A full-stack personal portfolio website for SDE / SWE / Web Developer fresher roles.

## 🧱 Tech Stack

- **Frontend:** React (Vite), Lucide Icons, react-icons (brand logos), react-type-animation
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Email:** Nodemailer (Gmail SMTP) — for both contact form and hire popup
- **Styling:** Custom CSS with CSS variables for theming (light + dark)

## ✨ Features

1. **Hero with photo** — 3D mouse-tilt + glow halo + "Let's build together" status pill
2. **Typed animation** — name cycles through 4 role titles on page load
3. **5-line code card** — compact developer profile in JS syntax
4. **"I'm Hiring" popup** — recruiters fill a 6-field form (name, email, company, role, positions, salary) and you get a formatted email instantly
5. **Silent viewer tracking** — every visit is recorded in MongoDB (IP is hashed, not stored in cleartext) so you can see your traffic
6. **Coding profile cards** — cursor-tracking brand-color glow for each platform
7. **Light + dark themes** with theme toggle
8. **Contact form** with validation, rate-limiting, and email forwarding

## ❓ Do I need the `.env` file?

| What you want | Need `.env`? | Need MongoDB? | Need Gmail? |
| --- | --- | --- | --- |
| Just view the portfolio in the browser | ❌ No | ❌ No | ❌ No |
| Use the contact form (DB only) | ✅ Yes | ✅ Yes | ❌ No |
| Use the contact form (email forwarding) | ✅ Yes | ⚠️ Optional | ✅ Yes |
| Use the "I'm Hiring" popup | ✅ Yes | ⚠️ Optional | ✅ Yes |
| Track page views (silent) | ✅ Yes | ✅ Yes | ❌ No |

### What is `.env`?

`.env` (environment file) holds **secrets and config** that vary per environment. Putting real passwords in code is dangerous — if you push to GitHub, bots will scrape them within minutes. The `.env` file is in `.gitignore` so it never gets committed.

For this portfolio, the `.env` contains:
- `MONGO_URI` — database connection string
- `EMAIL_USER` / `EMAIL_PASS` — Gmail + App Password
- `EMAIL_TO` — where to forward messages
- `IP_SALT` — salt for hashing viewer IPs (GDPR-friendly)

## 🚀 Quick Start (full stack)

```powershell
cd portfolio-mern
npm run install-all
Copy-Item server\.env.example server\.env
notepad server\.env        # fill in Mongo URI + Gmail App Password
npm run dev
```

| Service | URL | Port |
| --- | --- | --- |
| React frontend | http://localhost:5173 | 5173 |
| Express API | http://localhost:5000/api/... | 5000 |

## 🔌 API Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/contact` | Submit the contact form (saves + emails) |
| `GET`  | `/api/profile` | Get your profile (if stored in DB) |
| `PUT`  | `/api/profile` | Update your profile |
| `POST` | `/api/hire` | Submit a hiring inquiry (saves + emails) |
| `POST` | `/api/views` | Record a page view (silent, IP hashed) |
| `GET`  | `/api/views/stats` | Get view counts (total, 24h, 7d) |
| `POST` | `/api/admin/login` | Admin login (returns bearer token) |
| `GET`  | `/api/admin/overview` | Dashboard overview stats |
| `GET`  | `/api/admin/views` | Paginated list of all views |
| `GET`  | `/api/admin/messages` | List contact form messages |
| `GET`  | `/api/admin/hires` | List hire inquiries |
| `GET`  | `/api/health` | Health check |

## 📁 Project Structure

```
portfolio-mern/
├── client/
│   ├── public/             # profile.png, favicon
│   ├── src/
│   │   ├── components/     # Navbar, Footer, HireModal, BrandIcons
│   │   ├── sections/       # Hero, About, Skills, Projects, Education, Achievements, Contact
│   │   ├── context/        # Theme context
│   │   ├── data/           # portfolioData.js
│   │   ├── styles/         # index.css
│   │   ├── utils/          # api.js, tracker.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/        # contact, profile, hire, view
│   ├── models/             # ContactMessage, Profile, HireInquiry, PageView
│   ├── routes/             # contactRoutes, profileRoutes, hireRoutes, viewRoutes
│   ├── middleware/         # rateLimiter, sendEmail
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── package.json
```

## 🛠 Customising Content

All portfolio content lives in **`client/src/data/portfolioData.js`**.


## 🔐 Hidden Admin Dashboard

Your portfolio has a **hidden admin dashboard** that no one can find by clicking around the public site. Access it at:

```
http://localhost:5173/#admin
```

(When deployed, use your domain + `/#admin`.)

**First-time setup:**
1. Open `server/.env`
2. Add a line: `ADMIN_SECRET=any-long-string-you-want`
3. Restart the server
4. Visit `http://localhost:5173/#admin`
5. Type your secret to unlock

**What the dashboard shows:**
- 📊 Total / 24h / 7d / 30d views (with unique-visitor counts)
- 📈 Bar chart of views over the last 30 days
- 🌍 Top countries, browsers, referrers
- 📩 All contact form messages (with read/unread tracking + Reply button)
- 💼 All "I'm Hiring" inquiries (with Reply button)
- 👥 Full list of recent visitors with browser / UA / IP-hash
- 🗑️ Delete or mark-read for messages
- 🔄 Auto-refreshes every 30 seconds

**Security:**
- Only accessible via the `/#admin` URL (no link on the public site)
- Protected by your `ADMIN_SECRET` password
- Constant-time comparison (no timing attacks)
- Bearer token auth (24h session in `sessionStorage`)
- Wrong password = generic "Invalid secret" message (no info leak)

**Privacy:**
- All IPs are stored as SHA-256 hashes (not cleartext)
- The dashboard is invisible to anyone who doesn't know the URL
