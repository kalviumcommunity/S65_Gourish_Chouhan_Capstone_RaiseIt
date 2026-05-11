# RaiseIt

RaiseIt is a full-stack community platform for raising public concerns, organizing community groups, discussing solutions, collecting donations for admin-managed causes, and moderating user-generated content.

The app includes email/password auth, Google OAuth, Cloudinary image uploads, Razorpay donations, Gemini-powered help chat with fallback responses, user profiles, group discussions, and an admin dashboard for moderation and donation cause management.

## Features

- User registration, login, JWT sessions, and Google OAuth
- Role-based admin access using an `ADMIN_EMAILS` allowlist
- Public concerns with search, tags, status filters, comments, upvotes, reports, edit, and delete
- Community groups with join/leave, discussions, replies, and reporting
- User profiles with avatar, cover image, bio, contact, education, work experience, concerns, groups, and donation history
- Cloudinary-backed image uploads
- Razorpay donation checkout with payment verification and persisted donation records
- DB-backed donation causes managed from the admin dashboard
- Admin moderation for reported concerns, groups, and discussions
- Gemini chatbot with resilient fallback answers when the external API is unavailable
- Production hardening with Helmet, CORS origin allowlisting, API rate limits, upload limits, and production env validation

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Radix UI, Lucide React |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT, bcrypt, Passport Google OAuth |
| Uploads | Cloudinary, Multer memory storage |
| Payments | Razorpay |
| AI Helper | Google Gemini API with app fallback responses |
| Security | Helmet, CORS, express-rate-limit, env validation |
| Testing | Node test runner, Supertest |

## Repository Structure

```text
RaiseIt/
  client/                 React frontend
    src/
      components/         Shared UI and layout components
      context/            Auth context
      pages/              Route pages
      services/           API client functions
      config.js           Frontend runtime config
  server/                 Express backend
    config/               DB, Cloudinary, Passport, Razorpay, env validation
    controllers/          Route handlers
    middlewares/          Auth, optional auth, rate limiters
    models/               Mongoose models
    routes/               API routes
    test/                 Backend tests
```

## Prerequisites

- Node.js 20 or newer recommended
- npm
- MongoDB local instance or MongoDB Atlas cluster
- Cloudinary account for image uploads
- Razorpay account for payment checkout
- Google OAuth credentials if Google login is enabled
- Gemini API key if AI responses are enabled

## Environment Variables

Copy the example files before running the app:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

On Windows PowerShell, copy the files manually or run:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

### Server `.env`

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb://127.0.0.1:27017/RaiseIt
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAILS=admin@example.com

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash
```

Production notes:

- `JWT_SECRET` must be at least 32 characters when `NODE_ENV=production`.
- `CLIENT_URL` is required in production and supports comma-separated origins.
- Keep all secrets out of Git and configure them in your hosting provider.
- Use the existing MongoDB database name casing consistently. The local example uses `RaiseIt`.

### Client `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

For production, set `VITE_API_BASE_URL` to the deployed backend API URL, for example:

```env
VITE_API_BASE_URL=https://api.example.com/api
```

## Local Development

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

Start the backend:

```bash
cd server
npm start
```

Start the frontend:

```bash
cd client
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Backend health endpoint: `http://localhost:5000/`

## Admin Access

Admin access is granted at login time using the `ADMIN_EMAILS` environment variable.

1. Add the admin email to `server/.env`:

```env
ADMIN_EMAILS=admin@example.com
```

2. Restart the backend.
3. Log out and log back in with that email.
4. Open `/admin` in the frontend.

The admin dashboard supports:

- Reviewing reported content
- Hiding, restoring, or deleting reported concerns, groups, and discussions
- Creating, editing, activating, deactivating, and deleting donation causes

## Main Routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/auth` | Login and registration |
| `/concerns` | Browse concerns |
| `/concerns/new` | Create a concern |
| `/concerns/:id` | Concern details |
| `/community` | Browse groups |
| `/community/new` | Create a group |
| `/community/:id` | Group details and discussions |
| `/community/:id/discussions/:discussionId` | Discussion details |
| `/profile/:id` | User profile |
| `/profile/:id/edit` | Edit profile |
| `/donate` | Donation causes |
| `/donate/result` | Payment result |
| `/admin` | Admin dashboard |

## API Overview

| Prefix | Purpose |
| --- | --- |
| `/api/auth` | Register, login, Google OAuth |
| `/api/users` | Profiles, user concerns, groups, donations |
| `/api/concerns` | Concern CRUD, upvotes, comments, reports |
| `/api/groups` | Groups, discussions, replies, reports |
| `/api/causes` | Public active donation causes |
| `/api/payments` | Razorpay order creation, verification, donation history |
| `/api/upload` | Cloudinary image upload |
| `/api/gemini` | Chatbot responses |
| `/api/admin` | Admin summary, moderation, cause management |

## Testing And Verification

Run backend tests:

```bash
cd server
npm test
```

Check frontend linting:

```bash
cd client
npm run lint
```

Build frontend production assets:

```bash
cd client
npm run build
```

Audit production dependencies:

```bash
cd server
npm audit --audit-level=high --omit=dev

cd ../client
npm audit --audit-level=high --omit=dev
```

The current build may warn about large client chunks. The build still succeeds. For better production performance, add route-level lazy loading or manual chunking for heavy landing-page assets.

## Deployment Checklist

Before deploying:

- Set `NODE_ENV=production` on the backend.
- Use a long random `JWT_SECRET` with at least 32 characters.
- Set production `CLIENT_URL` to the frontend origin. Use comma-separated origins only when needed.
- Set `VITE_API_BASE_URL` to the deployed backend `/api` URL.
- Configure MongoDB Atlas or another production MongoDB instance.
- Configure Cloudinary credentials.
- Configure Razorpay keys and verify test/live mode intentionally.
- Configure Google OAuth callback URL to match the deployed backend.
- Configure Gemini API key or accept fallback chatbot behavior.
- Set `ADMIN_EMAILS` for initial admin users.
- Add donation causes from the admin dashboard after deployment.
- Run backend tests, frontend lint, frontend build, and production dependency audits.

## Security Notes

- Passwords are hashed with bcrypt before storage.
- Authenticated APIs use JWT bearer tokens.
- Admin APIs require both authentication and admin role checks.
- Public CORS access is restricted to configured client origins.
- Helmet is enabled for common HTTP security headers.
- API, auth, and upload endpoints are rate-limited.
- Uploads are sent to Cloudinary using memory storage rather than local disk persistence.
- Payment verification uses Razorpay signature validation before marking donations as verified.

## Operational Notes

- If profile routes return `Route not found` locally, make sure the running backend process is the current codebase and restart the server.
- If Gemini returns quota errors, the app falls back to built-in responses.
- If donations fail immediately, verify both client and server Razorpay keys are configured.
- If uploads fail, verify all three Cloudinary variables are configured.
- If admin pages redirect home, confirm `ADMIN_EMAILS`, restart the backend, then log out and log back in.

## License

This project currently uses the license configured in `server/package.json`.

## Maintainer

RaiseIt is maintained as a full-stack community issue and donation platform. Use GitHub Issues for bugs, improvements, and deployment questions.
