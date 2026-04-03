from django.db import models
import uuid
from django.utils.text import slugify
from django.contrib.auth.models import User

class PersistedObject(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="%(class)s_created",
    )
    modified_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="%(class)s_modified",
    )

    users = models.ManyToManyField(
        User,
        related_name="%(class)s",
        blank=True,
    )

    #soft delete feature possibly to be implemented
    is_deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True

class Task(PersistedObject):
    name = models.CharField(max_length=200)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Project(PersistedObject):
    name = models.CharField(max_length=50)
    # Note: slug isn't unique so not used for actual lookups, just for nicer urls. pk is still used for lookups
    slug = models.SlugField()
    description = models.TextField()

    # making slug based off name
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class UserProfile(models.Model):
    """Represents a profile of a user. Contains additional metadata not in the default Django user object"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField()
