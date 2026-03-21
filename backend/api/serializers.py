from rest_framework import serializers
from .models import Task, Project

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "name", "completed"]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "uuid",
            "name",
            "slug",
            "description",
            "created_at",
            "modified_at",
            "created_by",
            "modified_by",
            "is_deleted",
        ]

        read_only_fields = [
            "id",
            "uuid",
            "slug",
            "created_at",
            "modified_at",
            "created_by",
            "modified_by",
        ]