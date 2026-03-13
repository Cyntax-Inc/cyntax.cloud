```markdown
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

```
cyntax-cloud/
│
├── app/                      # Next.js App Router (no src folder)
│   ├── api/
│   │   └── lead/
│   │       └── route.ts      # API endpoint to store form data in Firestore
│   ├── layout.tsx            # Root layout with ThemeProvider and global styles
│   ├── page.tsx              # Main SPA sections (Hero, Services, Reviews, etc.)
│   ├── globals.css           # Tailwind base + custom CSS
│   └── robots.ts             # Optional SEO configuration
│
├── components/               # Reusable UI components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Reviews.tsx
│   ├── About.tsx
│   ├── LeadForm.tsx
│   ├── Footer.tsx
│   └── ThemeToggle.tsx
│
├── lib/                      # Utility and config modules
│   └── firebaseAdmin.ts      # Firebase Admin SDK runtime initialization
│
├── public/                   # Static assets (images, icons, logos)
│
├── .github/
│   └── workflows/
│       └── docker.yml        # GitHub Actions workflow for Docker build & push
│
├── .dockerignore             # Ignore unnecessary files from image
├── Dockerfile                # Multi-stage build for production
├── postcss.config.js         # PostCSS setup for Tailwind
├── tailwind.config.js        # Tailwind theme and content paths
├── package.json
├── tsconfig.json
└── README.md

```

````

---

## ⚙️ Setup & Development

### 1. Clone and install
```bash
git clone https://github.com/your-username/cyntax-cloud.git
cd cyntax-cloud
npm install
````

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

