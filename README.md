# LifeFlow Blood Donation Platform

LifeFlow connects blood recipients, donors, volunteers, and administrators. Users can publish blood requests, search active donors, volunteer to donate, manage request lifecycles, and contribute funds through Stripe.

## Live URL

[https://life-flow-client.vercel.app/](https://life-flow-client.vercel.app/)

## Key features

- Email/password authentication with Better Auth and MongoDB
- JWT issuing/JWKS support for protected API integrations
- Donor, volunteer, and admin role-based dashboards
- Responsive dashboard sidebar with private profile management
- Donation request creation, editing, deletion, filtering, and pagination
- Atomic `pending → inprogress` donation confirmation with donor information
- Donor-controlled `inprogress → done/canceled` status transitions
- Admin user blocking/unblocking and role management
- Volunteer status-only donation-request management
- Public pending-request listing and private request details
- Active donor search by blood group, district, and upazila
- Stripe Checkout funding with signed webhook recording
- ImgBB avatar uploads and responsive dark-mode UI

## Main routes

- `/` — landing page
- `/auth/register`, `/auth/login` — authentication
- `/donation-requests` — public pending requests
- `/donation-requests/[id]` — private request details and donation confirmation
- `/search` — donor search
- `/funding` — private funding history and Stripe checkout
- `/dashboard` — role-aware dashboard home
- `/dashboard/profile` — profile management
- `/dashboard/create-donation-request` — create a request
- `/dashboard/my-donation-requests` — donor-owned requests
- `/dashboard/all-users` — admin user management
- `/dashboard/all-blood-donation-request` — admin/volunteer request management

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and provide real credentials.
3. Start development with `npm run dev`.
4. Open `http://localhost:3000`.

## Stripe webhook

Configure Stripe to send `checkout.session.completed` events to:

```text
https://life-flow-server-taupe.vercel.app/api/stripe/webhook
```

For local testing, forward Stripe CLI events to `http://localhost:4000/api/stripe/webhook` and set the generated signing secret as `STRIPE_WEBHOOK_SECRET`.

## Scripts

- `npm run dev` — development server
- `npm run lint` — ESLint validation
- `npm run build` — production build
- `npm start` — production server

## Packages

Next.js 16, React 19, Better Auth, MongoDB, HeroUI, Tailwind CSS, Stripe, React Toastify, React Icons, and Swiper.
