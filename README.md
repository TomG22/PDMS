# PDMS

## Running the Application (with Docker)

Either run in VSC to automatically launch the docker configuration or use the following command in the command line:
```bash
docker compose up -d --build
```

Either approach launches two docker containers:
pdms_backend  - localhost:8000
pdms_frontend - localhost:3000


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
