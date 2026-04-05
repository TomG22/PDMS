from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task, Project, PersistedObject

class PersistedObjectSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source="created_by.username", read_only=True)
    modified_by = serializers.CharField(source="modified_by.username", read_only=True)

    class Meta:
        model = PersistedObject
        fields = [
            "id",
            "uuid",
            "name",
            "created_at",
            "modified_at",
            "created_by",
            "modified_by",
            "is_deleted",
        ]

        read_only_fields = [
            "id",
            "uuid",
            "created_at",
            "modified_at",
            "created_by",
            "modified_by",
        ]

class TaskSerializer(PersistedObjectSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())

    class Meta:
        model = Task
        fields = [
            "id",
            "name",
            "completed",
            "description",
            "project"
        ]
        read_only_fields = [
            "id"
        ]

class ProjectSerializer(PersistedObjectSerializer):
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
            "name",
            "slug",
            "description",
            "users",
            "user_ids"
        ]
        read_only_fields = [
            "id",
            "slug",
            "users",
            "user_ids"
        ]
    
    def get_users(self, obj):
        return [
        {"id": user.id, "username": user.username}
        for user in obj.users.all()
        ]
