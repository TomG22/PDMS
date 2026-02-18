from django.db import models

class Task(models.Model):
    name = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
