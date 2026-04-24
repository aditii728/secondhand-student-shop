# Secondhand Student Shop Frontend

## Environment

For local development, the frontend defaults to `/api` and uses the Vite proxy.

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

## Build

```bash
npm run build
```

The frontend expects the backend API to expose listings at `/api/items/`.
