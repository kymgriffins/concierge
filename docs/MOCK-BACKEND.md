# Mock JSON Backend (local)

This project includes a small JSON-backed mock backend and Next.js API routes for local development.

## Files added

- `data/mockdb.json` — seed data (agents, bookings, sessions)
- `lib/json-db.ts` — helper to read/write the JSON file
- `app/api/auth/route.ts` — login (POST `/api/auth`), me (GET `/api/auth`), logout (DELETE `/api/auth`)
- `app/api/bookings/route.ts` — GET `/api/bookings`, POST `/api/bookings` (requires concierge or supervisor)
- `app/api/bookings/[id]/route.ts` — GET/PUT/DELETE single bookings (auth & roles enforced)
- `app/api/sessions/route.ts` — GET `/api/sessions` (requires supervisor)
- `scripts/test-auth.sh` — simple curl-based smoke test

## Quick start

1. Start dev server:

   pnpm dev

2. Login (curl example):

   curl -c /tmp/mock_cookies -X POST http://localhost:3000/api/auth -H "Content-Type: application/json" -d '{"username":"supervisor","password":"super999"}'

3. Check current user (uses cookie):

   curl -b /tmp/mock_cookies http://localhost:3000/api/auth

4. Create a booking (requires concierge or supervisor):

   curl -b /tmp/mock_cookies -X POST http://localhost:3000/api/bookings -H "Content-Type: application/json" -d '{"passengerName":"Test","company":"X","phone":"+1","email":"t@x.com","flightNumber":"XX 1","airline":"X","date":"2025-12-20","time":"10:00","passengerCount":1,"services":[],"specialRequests":"","status":"new","source":"manual"}'

Notes:

- This is a development-only mock backend. Data is persisted to `data/mockdb.json`.
- Passwords are stored in plain text for convenience (do not use in production).
- Cookies are HTTP-only and persisted for 24 hours.
