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

Either approach launches two Docker containers:

* pdms_backend-1  - localhost:8000
* pdms_frontend-1 - localhost:3000

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
# Install packages
cd frontend
pnpm install --frozen-lockfile

# Run server
pnpm start
```

### With Docker

For Docker-based CLI development, run the following:

```bash
docker compose -f docker-compose-cli.yml up -d --build
```

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

## Latest Development

Currently, the only path that is active on the backend is the following:
http://localhost:8000/api/tasks/

This can be accessed in the browser or via curl in the command line with:
curl http://localhost:8000/api/tasks/

Currently, there's two main pages that are active on the frontend:
http://localhost:3000/          - Static homepage with page navigation
http://localhost:3000/test      - Fetches the db for testing the backend API

All of the active routes:
/
/login
/register
/test 

## Developing on the Application

See `CONTRIBUTING.md`.
