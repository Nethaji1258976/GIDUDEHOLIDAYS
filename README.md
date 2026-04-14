# 🌍 GoDude Holidays v2 — B2B Travel Website

**Node.js + Express + MongoDB + EJS + Full Admin Panel**

---

## ✨ Features

- 🎨 **Tropical luxury design** with unique CSS (Playfair Display + DM Sans + Bebas Neue fonts)
- ✈ **Hero banner** with animated particles and floating WhatsApp button
- 📦 **5 destination pages**: Singapore, Malaysia, Bali, Thailand, Vietnam — with image galleries & package cards
- 🛎 **Services page**: Hotel, Transfers, Sightseeing, Tickets, Custom Packages, B2B
- 🤝 **B2B Partner registration** with AJAX form submission
- 📧 **Quick Quote form** on homepage via AJAX
- 🔐 **User auth**: Register, Login, Logout (sessions stored in MongoDB)
- 🛠 **Admin Panel** — full CRUD, no technical knowledge needed:
  - Add / Edit / Delete travel packages
  - View & delete contact enquiries, mark as read
  - Approve / Reject / Delete B2B agent registrations
  - Enable / Disable / Delete registered users
  - Dashboard with live stats

---

## 📁 Folder Structure

```
godude-holidays/
├── server.js              ← Express server
├── models.js              ← Mongoose: User, Contact, Agent
├── models/
│   └── Package.js         ← Package model
├── routes/
│   ├── auth.js            ← /register /login /logout
│   ├── main.js            ← Protected site pages
│   ├── api.js             ← AJAX form endpoints
│   └── admin.js           ← Full admin CRUD panel
├── middleware/
│   └── auth.js            ← isUserAuthenticated, isAdminAuthenticated
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   └── admin-sidebar.ejs
│   ├── index.ejs           ← Home
│   ├── destinations.ejs
│   ├── services.ejs
│   ├── about.ejs
│   ├── b2b.ejs
│   ├── contact.ejs
│   ├── auth-login.ejs
│   ├── auth-register.ejs
│   ├── 404.ejs
│   ├── admin-login.ejs
│   ├── admin-dashboard.ejs
│   ├── admin-packages.ejs
│   ├── admin-package-form.ejs
│   ├── admin-contacts.ejs
│   ├── admin-agents.ejs
│   └── admin-users.ejs
├── public/
│   ├── css/style.css       ← Main site styles
│   ├── css/admin.css       ← Admin panel styles
│   ├── js/main.js          ← Frontend JS
│   └── images/logo.jpeg    ← GoDude logo
├── .env.example
└── package.json
```

---

## ⚙️ Setup

### Step 1 — Install Node.js (v18+)
Download from https://nodejs.org

### Step 2 — Install MongoDB
- **Local**: https://www.mongodb.com/try/download/community
- **Cloud (recommended)**: https://mongodb.com/atlas (free tier)

### Step 3 — Install dependencies
```bash
cd godude-holidays
npm install
```

### Step 4 — Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```
MONGODB_URI=mongodb://127.0.0.1:27017/godude_holidays
SESSION_SECRET=your_long_random_secret_here
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=GoDude@2024
```

### Step 5 — Run
```bash
npm start
# or development with auto-restart:
npm run dev
```

---

## 🌐 URLs

| Page | URL | Access |
|------|-----|--------|
| Home | / | 🔒 Login required |
| Destinations | /destinations | 🔒 Login required |
| Services | /services | 🔒 Login required |
| About | /about | 🔒 Login required |
| B2B Partner | /b2b | 🔒 Login required |
| Contact | /contact | 🔒 Login required |
| Register | /register | Public |
| Login | /login | Public |
| Admin Panel | /admin | 🔐 Admin only |

---

## 🔐 Admin Panel

**URL**: http://localhost:3000/admin  
**Default login**: `admin` / `GoDude@2024`  
**Change in**: `.env` → `ADMIN_USERNAME` and `ADMIN_PASSWORD`

### Admin capabilities (no technical knowledge needed):
- **Dashboard**: Live stats — users, enquiries, agents, packages
- **Packages**: Add/edit/delete travel packages with image preview
- **Enquiries**: View all contact forms, mark read, reply via email, delete
- **B2B Agents**: Approve/reject/delete partner registrations
- **Users**: Enable/disable/delete registered website users

---

## ☁️ Deploy to Render.com (Free)

1. Push code to GitHub
2. Go to https://render.com → **New Web Service**
3. Connect your repo
4. Build: `npm install` | Start: `node server.js`
5. Add environment variables from your `.env`
6. Use MongoDB Atlas URI for `MONGODB_URI`
7. Deploy — get a free `.onrender.com` domain

---

*GoDude Holidays © 2024 | Madurai, Tamil Nadu 🌴*
