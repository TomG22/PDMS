# Contributing to the Backend
## Modifying ./api/models.py
If you ever need to change the schemas for the database, then you will need to create a new migration and then apply it.
Run the following commands to do so if you are running in a docker container:
```bash
docker exec -it python manage.py makemigrations
docker exec -it python manage.py migrate
```
Otherwise, you can run these commands natively:
```bash
python manage.py makemigrations
python manage.py migrate
```