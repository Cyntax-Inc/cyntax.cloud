
# 🏗️ Cyntax Cloud — Next.js Single Page App

A clean, responsive **Next.js** marketing site for a concrete company with Firebase-powered form submissions, dark/light mode, and Docker-ready deployment.

---

## 🚀 Features

- **Single Page App** built with **Next.js App Router**
- **Tailwind CSS** for responsive design (light/dark mode)
- **Hero**, **Services**, **Reviews**, **About**, **Contact Form**, and **Footer** sections
- **Form submissions** stored securely in **Firebase Firestore** via server API route
- **Zod validation** for clean form input handling
- **Docker + GitHub Actions** for easy CI/CD
- **Firebase Admin** initialized safely (runtime, not at build)
- **SEO-ready** with metadata and robots configuration

---

## 📁 Folder Structure



```
cyntax-cloud/
│
├── app/                                  # Next.js App Router (no src folder)
│   ├── api/                              # Server-side API routes
│   │   ├── billing/
│   │   │   └── route.ts                  # Creates Stripe Checkout session for invoice payments
│   │   ├── ticket/
│   │   │   └── route.ts                  # Creates support tickets in Firestore and sends Postmark email
│   │   ├── tickets/
│   │   │   └── route.ts                  # Optional route for returning authenticated user tickets
│   │   ├── stripe/
│   │       └── webhook/
│   │           └── route.ts              # Stripe webhook handler for invoice payment updates
│   │
│   ├── dashboard/                        # Protected client portal area
│   │   ├── layout.tsx                    # Shared dashboard layout with themed navigation
│   │   ├── page.tsx                      # Dashboard overview landing page
│   │   ├── billing/
│   │   │   └── page.tsx                  # Billing page with invoice list and pay-now flow
│   │   └── tickets/
│   │       ├── page.tsx                  # Ticket listing page
│   │       └── new/
│   │           └── page.tsx              # New ticket submission page
│   │
│   ├── login/
│   │   └── page.tsx                      # Client login page using Firebase Auth
│   │
│   ├── globals.css                       # Global styles and Tailwind base
│   ├── layout.tsx                        # Root application layout
│   ├── page.tsx                          # Homepage SPA entry
│   └── robots.ts                         # Optional robots / SEO config
│
├── components/                           # Reusable UI components
│   ├── dashboard/
│   │   ├── DashboardNav.tsx              # Sidebar navigation for client portal
│   │   ├── InvoiceList.tsx               # Styled invoice/payment list component
│   │   ├── NewTicketForm.tsx             # Ticket submission form component
│   │   ├── PortalHeader.tsx              # Optional shared dashboard page heading wrapper
│   │   └── TicketList.tsx                # Styled support ticket list/table
│   │
│   ├── homepage/
│   │   ├── Carousel.tsx
│   │   ├── Footer.tsx                    # Footer design benchmark for portal theme
│   │   ├── Hero.tsx
│   │   ├── LeadForm.tsx
│   │   ├── Navbar.tsx
│   │   ├── Packages.tsx
│   │   ├── Pricing.tsx
│   │   ├── Reviews.tsx
│   │   ├── Services.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── Tooling.tsx
│   │
│   └── icons/                            # Static tooling icons and image assets
│
├── lib/                                  # Utility/config/server integration modules
│   ├── firebase.ts                       # Firebase client SDK init for browser auth + Firestore
│   ├── firebaseAdmin.ts                  # Firebase Admin SDK init using FIREBASE_SERVICE_ACCOUNT_KEY
│   ├── postmark.ts                       # Postmark email client and support ticket email sender
│   └── stripe.ts                         # Stripe server SDK initialization
│
├── public/                               # Static assets
│
├── .github/
│   └── workflows/
│       └── docker.yml                    # GitHub Actions Docker build/push workflow
│
├── .dockerignore                         # Docker ignore rules
├── .env.local                            # Local environment variables (not committed)
├── Dockerfile                            # Production Docker build
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json

```



---

## ⚙️ Setup & Development

### 1. Clone and install
```bash
git clone https://github.com/your-username/cyntax-cloud.git
cd cyntax-cloud
npm install
```

### 2. Create `.env.local`

```ini
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
# Use one of these options:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqh...\n-----END PRIVATE KEY-----\n"
# OR
FIREBASE_PRIVATE_KEY_BASE64=LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t...
FIREBASE_LEADS_COLLECTION=leads
```

### 3. Run the dev server

```bash
npm run dev
# Visit http://localhost:3000
```

---

## 🧱 Firebase Setup

This project expects a Firestore collection for leads:

```
Collection: leads
Fields:
  name        string
  email       string
  phone       string
  service     string
  message     string
  createdAt   timestamp
  status      string ("new")
```

---

## 🐳 Docker

### Build and run locally

```bash
docker build -t cyntax-cloud .
docker run -p 3000:3000 \
  -e FIREBASE_PROJECT_ID=your-project-id \
  -e FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com \
  -e FIREBASE_PRIVATE_KEY_BASE64=$(cat key.b64) \
  cyntax-cloud
```

### Publish via GitHub Actions

* Set the following **repository secrets** in GitHub:

  * `DOCKERHUB_USERNAME`
  * `DOCKERHUB_TOKEN`
* Push to `main`, or trigger manually:

```yaml
.github/workflows/docker.yml
```

This builds and pushes your image to Docker Hub automatically.

---

## 🌗 Theming & Customization

* Dark/light mode handled by **`next-themes`**
* Update brand colors in `tailwind.config.js`
* Replace hero image, text, and testimonials in respective components

---

## 🧰 Tech Stack

* **Next.js 14+ (App Router)**
* **Tailwind CSS v4**
* **Firebase Admin SDK**
* **Zod** for form validation
* **Docker & GitHub Actions** for CI/CD

---

## 🧾 License

MIT © 2026 Cyntax Cloud — Built with ❤️ using Next.js

