from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task, Project

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "name", "completed"]

class ProjectSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source="created_by.username", read_only=True)
    modified_by = serializers.CharField(source="modified_by.username", read_only=True)

    users = serializers.SerializerMethodField(read_only=True)

    user_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        write_only=True,
        required=False,
        source="users",
    )

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
            "users",
            "user_ids",
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
            "users",
        ]
    def get_users(self, obj):
        return [
        {"id": user.id, "username": user.username}
        for user in obj.users.all()
        ]