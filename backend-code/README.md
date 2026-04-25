# Backend Setup

## Local Postgres

Start PostgreSQL with Docker:

```bash
cd backend-code
docker compose up -d postgres
```

Then export database settings before running Django:

```bash
export DB_NAME=student_shop
export DB_USER=student_shop_user
export DB_PASSWORD=student_shop_password
export DB_HOST=127.0.0.1
export DB_PORT=5432
```

Run migrations:

```bash
source .venv/bin/activate
python manage.py migrate
python manage.py runserver
```

## Deployment

For deployment, prefer a managed Postgres database and set `DATABASE_URL` in your hosting platform.

If your provider requires SSL, also set:

```bash
DB_SSLMODE=require
```

If `DATABASE_URL` is present, Django will use PostgreSQL automatically.
change