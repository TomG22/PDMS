from django.db import models
import uuid
from django.utils.text import slugify
from django.contrib.auth.models import User

# Was an example, but now TODO
class Task(models.Model):
    name = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)

class Project(models.Model):
    name = models.CharField(max_length=50)
    # Note: slug isn't unique so not used for actual lookups, just for nicer urls. pk is still used for lookups
    slug = models.SlugField()
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="projects_created",
    )
    modified_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="projects_modified",
    )

    users = models.ManyToManyField(
        User,
        related_name="projects",
        blank=True,
    )
    #soft delete feature possibly to be implemented
    is_deleted = models.BooleanField(default=False)

    # making slug based off name
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name





