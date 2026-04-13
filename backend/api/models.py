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

    #soft delete feature possibly to be implemented
    is_deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True

class Project(PersistedObject):
    name = models.CharField(max_length=50)
    # Note: slug isn't unique so not used for actual lookups, just for nicer urls. pk is still used for lookups
    slug = models.SlugField()
    description = models.TextField()

    # Only a user added to a project can view it
    users = models.ManyToManyField(
        User,
        related_name="%(class)s",
        blank=True,
    )

    # making slug based off name
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class Task(PersistedObject):
    # using integers for ordering purposes
    class Priority(models.IntegerChoices):
        NONE = 0, "None"
        LOW = 1, "Low"
        MEDIUM = 2, "Medium"
        HIGH = 3, "High"

    class Status(models.TextChoices):
        READY_TO_BEGIN = "ready_to_begin", "Ready to Begin"
        IN_PROGRESS = "in_progress", "In Progress"
        UNDER_REVIEW = "under_review", "Under Review"
        TESTING = "testing", "Testing"
        DONE = "done", "Done"    

    name = models.CharField(max_length=200)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    priority = models.IntegerField(choices=Priority.choices, default=Priority.NONE)
    status = models.CharField(max_length=14, choices=Status.choices, default=Status.READY_TO_BEGIN)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    sprint = models.ForeignKey("Sprint", on_delete=models.SET_NULL, null=True, blank=True) # on sprint delete, tasks go to product backlog

    class Meta:
        ordering = ["-priority", "-created_at"] # order by priority first, then created at
    
class UserProfile(models.Model):
    """Represents a profile of a user. Contains additional metadata not in the default Django user object"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.TextField(default="")
    last_name = models.TextField(default="")
    bio = models.TextField(default="")

class Sprint(PersistedObject):
    name = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    completed = models.BooleanField(default=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
