# Secondhand Student Shop Frontend

## Environment

For local development, the frontend defaults to `/api` and uses the Vite proxy.
This repo now includes a local-only [`.env.local`](./.env.local) with:

```bash
VITE_BACKEND_URL=http://127.0.0.1:8000
```

That lets the Vite dev server proxy `/api` and `/media` requests to the local Django backend.

For deployed environments such as Vercel, set:

```bash
VITE_API_BASE_URL=https://your-backend-domain.vercel.app/api
```

See [`.env.example`](./.env.example) for the expected format.

## Development

```bash
npm install
npm run dev
```

Run the Django backend separately on `http://127.0.0.1:8000` while the frontend is running.

## Build

```bash
npm run build
```

The frontend expects the backend API to expose listings at `/api/items/`.
