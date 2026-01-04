Neon DB schema for Willis Protocol Concierge (MVP)

Files:
- `schema.sql` — SQL migration creating MVP tables: `profiles`, `bookings`, `activity_logs`, `payments`, `notifications`.

Quick apply (replace env var with your Neon connection string):

```bash
export DATABASE_URL="postgres://..." # Neon connection string
psql "$DATABASE_URL" -f db/schema.sql
```

Notes:
- This migration grants broad privileges to `PUBLIC` for fast development ("approve all actions"). For production, remove the GRANT and add RLS policies that check Neon Auth JWT claims.
- `profiles.user_id` can be set to the Neon Auth `user.id` if you capture it on signup.
