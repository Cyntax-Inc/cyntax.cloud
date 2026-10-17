# Cyntax Cloud

The official website and client portal for **Cyntax Inc.**

Cyntax Cloud provides a centralized platform for clients to manage support requests, communicate with our team, and access account and billing information.

## Features

- **Client Dashboard** — Overview of active support tickets and account activity.
- **Support Tickets** — Create, track, and manage support requests.
- **Conversations** — Communicate directly with the support team through ticket messaging.
- **Ticket Tracking** — Monitor ticket priority, status, and updates.
- **Billing** — Review invoices, payment status, and available payment options.
- **Account Management** — Access and manage personal and company information.
- **Responsive Interface** — Designed for desktop, tablet, and mobile devices.

## Getting Started

### Requirements

- Node.js 22+
- npm
- Git
- Project environment configuration

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Cyntax-Inc/cyntax.cloud.git
cd cyntax.cloud
npm ci
```

Configure your local environment using the credentials and configuration supplied by the project maintainer.

Create a `.env.local` file in the project root. Environment credentials are not included in this repository.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run code linting |
| `npm run test:unit` | Run unit tests |

To update an existing local checkout:

```bash
git pull
npm ci
```

## Application Access

Cyntax Cloud is designed as a self-service portal. Authenticated users can access their own tickets and account information.

Administrative and support management workflows are handled separately through **admin.cyntax.cloud**, with access restricted to authorized personnel.

## Security

Security and client privacy are important considerations throughout development. Sensitive configuration, credentials, and environment files should never be committed to the repository.

Please report security concerns privately to the Cyntax team rather than through public issues.

## About Cyntax Inc.

Cyntax Inc. provides software development, infrastructure, and technology services.

Visit [cyntax.cloud](https://cyntax.cloud) to learn more.

---

© Cyntax Inc. All rights reserved.