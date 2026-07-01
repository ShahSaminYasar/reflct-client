# Reflct — Digital Life Lessons Platform

A platform where users can create, store, and share meaningful life lessons, personal growth insights, and wisdom gathered over time.

## 🌐 Live URL

[https://ssy-reflct.vercel.app](https://ssy-reflct.vercel.app)

## 📋 Project Purpose

Reflct helps people preserve personal wisdom, encourages mindful reflection, and allows users to grow by exploring lessons from the community. Users can organize lessons, mark favorites, and browse public lessons shared by others — with Free and Premium membership tiers.

## ✨ Key Features

- 🔐 Email/password and Google OAuth authentication via Better Auth
- 📝 Create, edit, and delete life lessons with rich details
- 🌍 Browse public lessons with search, filter, sort, and pagination
- 🔒 Premium lesson access control with blur/lock for free users
- ❤️ Like, save to favorites, comment, and report lessons
- 💳 Stripe payment integration for one-time Premium upgrade (৳1,500)
- 📊 User dashboard with activity chart and lesson analytics
- 🛡️ Admin dashboard — manage users, lessons, reported content
- 🌟 Featured lessons, top contributors, most saved sections on home
- 🖼️ Image upload via ImgBB
- 📱 Fully responsive — mobile, tablet, desktop
- 🎨 Dark/light theme support

## 🔑 Admin Credentials

| Field    | Value                      |
|----------|----------------------------|
| Email    | admin@email.com            |
| Password | Admin@123                  |

## 🔗 GitHub Repositories

- **Client:** [https://github.com/ShahSaminYasar/reflct-client](https://github.com/ShahSaminYasar/reflct-client)
- **Server:** [https://github.com/ShahSaminYasar/reflct-server](https://github.com/ShahSaminYasar/reflct-server)

## 📦 NPM Packages Used

### Client
| Package | Purpose |
|---|---|
| `next` | React framework with App Router |
| `react` | UI library |
| `tailwindcss` | Utility-first CSS framework |
| `better-auth` | Authentication (email, Google OAuth, Bearer token) |
| `sonner` | Toast notifications |
| `motion` | Animations (motion/react) |
| `recharts` | Charts and data visualization |
| `lucide-react` | Icon library |
| `@phosphor-icons/react` | Extended icon library |
| `shadcn/ui` | Component library (Button, Card, Input, Select, Dialog, etc.) |
| `@radix-ui/*` | Headless UI primitives (via shadcn) |

### Server
| Package | Purpose |
|---|---|
| `express` | Web server framework |
| `mongodb` | MongoDB native driver |
| `better-auth` | Authentication server + Bearer plugin |
| `stripe` | Payment processing |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable management |

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Stripe account (test mode)
- ImgBB account
- Google OAuth credentials

### Client Setup
```bash
git clone https://github.com/username/reflct-client
cd reflct-client
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_pk
STRIPE_SECRET_KEY=your_stripe_sk

MONGODB_URI=your_mongodb_uri_with_username_&_password_included
BETTER_AUTH_SECRET=secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

```bash
npm run dev
```  

## 🗂️ Project Structure  
client/
├── app/
│   ├── (main)/
│   │   ├── page.jsx              # Home
│   │   ├── lessons/              # Public lessons + single lesson
│   │   ├── pricing/              # Pricing + Stripe
│   │   ├── payment/              # Success + Cancel
│   │   ├── login/
│   │   ├── register/
│   │   └── dashboard/            # User + Admin dashboard
│   ├── layout.js                 # Root layout
│   └── not-found.jsx             # 404 page
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── GoogleAuthButton.jsx
├── lib/
│   ├── authClient.js
│   ├── apiFetch.js
│   └── token.js
└── proxy.js                      # Route protection (Next.js 16)  

## 🌐 Deployment

- **Client:** Vercel
- **Server:** Vercel/Render

## 📄 License

This project was built for Programming Hero Batch 13 - Assignment 10.