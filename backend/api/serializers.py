from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task, Project, PersistedObject, Sprint

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

    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True,
    )
    
    # assigned_to_username is just for display purposes and is read only
    assigned_to_username = serializers.CharField(
        source="assigned_to.username",
        read_only=True
    )

    # sprint is null == product backlog task
    sprint = serializers.PrimaryKeyRelatedField(
        queryset=Sprint.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "name",
            "completed",
            "description",
            "priority",
            "project",
            "assigned_to_id",
            "assigned_to_username",
            "sprint",
        ]

        read_only_fields = [
            "id",
            "assigned_to_username",
        ]

    def validate(self, attrs):
        project = attrs.get("project")
        assigned_to_id = attrs.get("assigned_to_id")
        sprint = attrs.get("sprint")  

        # handling patch requests where not all fields are required
        if self.instance:
            if project is None:
                project = self.instance.project
            if assigned_to_id is None:
                assigned_to_id = self.instance.assigned_to_id
            if sprint is None:
                sprint = self.instance.sprint

        # ensure user is part of the project
        if assigned_to_id and not project.users.filter(id=assigned_to_id.id).exists():
            raise serializers.ValidationError("User assigned to task must be part of the project")
        
        # ensure sprint is part of the project
        if sprint and sprint.project_id != project.id:
            raise serializers.ValidationError("Sprint must belong to the same project as the task")
        
        return attrs
        


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
    
class SprintSerializer(PersistedObjectSerializer):
    project = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Sprint
        fields = [
            "id",
            "name",
            "start_date",
            "end_date",
            "project",
        ]

        read_only_fields = [
            "id",
            "project",
        ]
