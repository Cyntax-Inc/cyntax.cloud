# Client portal release checklist

Test against isolated test users: a client account A, a client account B, and an existing admin-role account. Create tickets and invoices whose `userId` fields match each account's Firebase UID. Use Stripe test mode and do not send production payments during QA.

## Access and isolation

- [ ] Each account logs in and can view **only its own** ticket listing.
- [ ] Admin account sees only tickets created under its own UID; no client-wide queue appears.
- [ ] Direct URL to another account's ticket returns 404, including conversation and activity.
- [ ] `POST /api/tickets/[id]/messages` on another account's ticket returns 404, even for an admin.
- [ ] Admin `POST /api/ticket` and `POST /api/tickets/[id]/messages` both return 403.
- [ ] `PATCH /api/tickets/[id]`, `POST /api/invoices`, and `/api/clients` do not expose admin functionality.
- [ ] Admin `PATCH /api/settings/profile` and `POST /api/billing` return 403.
- [ ] PDF URL of an invoice belonging to another account returns 403, including for an admin.
- [ ] Direct client Firestore SDK calls cannot bypass tenant isolation (requires Firestore Security Rules review).

## UI and retained client workflows

- [ ] Client creates a ticket with subject/category/priority/description and is navigated to it.
- [ ] A client reply appears in the correct conversation without altering existing messages.
- [ ] Closed tickets display a read-only conversation; resolved tickets retain the existing reply behavior.
- [ ] Dashboard 'Active tickets' excludes resolved/closed and sorts by priority, then status, then recency.
- [ ] Ticket list tabs correctly separate active from resolved/closed.
- [ ] Billing summary uses real invoices and does not add different currencies into one amount.
- [ ] Client can edit profile, download own invoice PDF, and pay a valid unpaid invoice.
- [ ] Admin UI shows a view-only notice and no actionable create/reply/pay/edit controls.
- [ ] Mobile menu, navigation, dark UI, and ticket detail layout work at 320px, tablet, and desktop widths.
- [ ] A deactivated account and an expired/missing session cannot use protected APIs.

## Build and service checks

- [ ] `npm ci` succeeds in a network-enabled development/CI environment.
- [ ] `npm run test:unit`, `npm run lint`, and `npm run build` all succeed.
- [ ] Firebase Auth, Firestore Admin, Postmark, Stripe Checkout, and Stripe webhook exercised in test environment.
- [ ] No credentials, tokens, or production secrets are included in Git or released artifacts.
