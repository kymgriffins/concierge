#!/usr/bin/env bash
# Simple test script for mock auth endpoints (run after `pnpm dev`)
set -euo pipefail

if curl -sSf http://localhost:3000/api/auth >/dev/null 2>&1; then
  BASE=http://localhost:3000
elif curl -sSf http://localhost:3001/api/auth >/dev/null 2>&1; then
  BASE=http://localhost:3001
else
  echo "No dev server found on localhost:3000 or 3001. Start with 'pnpm dev' and retry." >&2
  exit 2
fi

echo "== Login as supervisor =="
RESP=$(curl -s -X POST "$BASE/api/auth" -H "Content-Type: application/json" -d '{"username":"supervisor","password":"super999"}')
echo $RESP

TOKEN=$(echo $RESP | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

if [ -z "$TOKEN" ]; then
  echo "login failed"
  exit 1
fi

# Use cookie-based flow: curl saves cookies to file
curl -s -c /tmp/mock_cookies -X POST "$BASE/api/auth" -H "Content-Type: application/json" -d '{"username":"supervisor","password":"super999"}' > /dev/null

echo "== GET /api/auth (me) using cookie =="
curl -s -b /tmp/mock_cookies "$BASE/api/auth"

echo "\n== Get bookings (empty) =="
curl -s -b /tmp/mock_cookies "$BASE/api/bookings"

echo "\n== Done =="
