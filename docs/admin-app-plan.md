# Future staff application — architectural preparation

The current Cyntax Cloud deployment is a **client portal** only. This plan documents the separation needed for the next application; it is not a deployed or running admin service.

## Separation principles

- Keep Firebase Auth identities and Firestore records compatible across the two apps.
- **Never** use `role === "admin"` as a bypass to ownership checks in client portal APIs.
- Build a dedicated authenticated staff app with server-side permission checks for every administrative route. A client portal login does not itself authorize staff APIs.
- Prefer narrow staff capabilities (`tickets:read_all`, `tickets:assign`, `tickets:update`, `messages:reply`, `invoices:create`, `clients:read`) over a permanent all-powerful role.
- Audit every staff write with actor UID, operation, resource ID, and timestamp.
- Store ticket and invoice domain code in separately testable services if these are later extracted to shared packages. Do not share unguarded Firebase Admin SDK endpoints between apps.
- Keep `userId` as the resource-owner UID; add future fields such as `assignedTo`, `teamId`, and `lastViewedByTeamAt` without replacing owner identity.

## Suggested new app scope

1. Staff authentication and role/permission gate
2. Ticket queue: triage, assignment, status/priority, reply, activity history
3. Client directory and customer account details
4. Invoice creation, issuing, audit and payments overview
5. Staff-only telemetry and activity logs

The previous PoC's admin UI (`CreateInvoiceForm`) and administration routes (`/api/clients`, `POST /api/invoices`, `PATCH /api/tickets/[id]`) were removed from the **client deployment**. Reimplement them under the dedicated staff surface with independent authorization and validation; use source control history for any previous form UX or field mapping.

## Pre-production backlog

- **Message privacy:** design at-rest/application-layer encryption for ticket descriptions and message bodies; define key management, rotation, search limitations, and support access. Do not present the current implementation as encrypted messaging.
- **Email privacy:** minimize ticket content sent to Postmark; prefer metadata and a link to the authenticated staff view once it exists.
- **Firestore Security Rules:** verify browser SDK users cannot read or write other users' tickets, messages, profiles or invoices, regardless of server authorization.
- **Session security:** rate-limit auth/ticket submission, monitor abuse, and review account provisioning and access disablement.
- **Tenant identity:** validate migration and ownership of older records missing or mislabeling `userId` before granting visibility.
- **Payments:** enforce invoice states on the backend and test Stripe webhook idempotency and out-of-order event handling.
- **Operational QA:** add emulator-backed authorization tests and deployed end-to-end checks for Firebase Auth, Firestore, Postmark, and Stripe test mode.
