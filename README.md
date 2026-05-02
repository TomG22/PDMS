# PDMS

## Running the Application for Production

Run the following:

```bash
# Frontend prerequisites
cd frontend
pnpm install --frozen-lockfile
cd ..

# Backend prerequisites
cd backend
python manage.py migrate
cd ..

# Run the services
docker compose up -d --build
```

You can access the frontend at `localhost:8080`.

## Running the Application for Development

### Without Docker

For non-Dockerized runs (ex. when inside a dev container), run the following:

#### Backend

```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

#### UI

```bash
# Frontend prerequisites
cd frontend
pnpm install --frozen-lockfile

# Run server
pnpm start
```

You can access the frontend at `localhost:3000`.

### With Docker

For Docker-based CLI development, run the following:

```bash
# Frontend prerequisites
cd frontend
pnpm install --frozen-lockfile
cd ..

# Backend prerequisites
cd backend
python manage.py migrate
cd ..

docker compose -f docker-compose-cli.yml up -d --build
```

You can access the frontend at `localhost:3000`.

## Troubleshooting

If you are getting database failures, ensure that your database is up-to-date:

```bash
cd backend/
python manage.py migrate
```

If you have made model changes, you first need to run the following, then rerun the above:

```bash
python manage.py makemigrations
python manage.py migrate
```

If all else fails, remove your local database file before continuing:

```bash
rm db.sqlite3
python manage.py migrate
```
