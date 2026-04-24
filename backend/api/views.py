from django.contrib.auth.models import User
from django.db import IntegrityError
import logging
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task, Project, UserProfile, Sprint
from .serializers import TaskSerializer, ProjectSerializer, SprintSerializer

logger = logging.getLogger(__name__)

class UserLogoutAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """Logs the user out"""
        try:
            refresh_token = RefreshToken(request.data["refresh_token"])
            refresh_token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except KeyError as e:
            return Response({"detail": "Missing refresh_token"},
                            status=status.HTTP_400_BAD_REQUEST)
        except TokenError as e:
            return Response({"detail": f"Invalid token given: {e}"},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error("Error while logging out", e)
            return Response({"detail": "Unexpected server error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserRegisterAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        """Creates a user"""
        password = request.data.get("password")
        email = request.data.get("email")
        first_name = request.data.get("firstName")
        last_name = request.data.get("lastName")

        try:
            user = User.objects.create(username=email, email=email)
            user.set_password(password)
            user.save()

            user_profile = UserProfile.objects.create(user=user, first_name=first_name, last_name=last_name)
            user_profile.save()
            return Response(
                {"detail": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        except KeyError as e:
            return Response({"detail": "Expected fields: (email, password)"},
                            status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as e:
            return Response({"detail": "Invalid or non-unique user given"},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error("Error while registering", e)
            return Response({"detail": "Unexpected server error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user

        response = {
            "id": user.id,
            "email": user.email,
            "first_name": user.userprofile.first_name,
            "last_name": user.userprofile.last_name,
            "bio": user.userprofile.bio
        }

        return Response(response, status=200)
    
    def put(self, request):
        user = request.user
        user_profile = user.userprofile

        email = request.data.get("email")
        first_name = request.data.get("firstName")
        last_name = request.data.get("lastName")
        bio = request.data.get("bio")

        user.email = email
        user_profile.first_name = first_name
        user_profile.last_name = last_name
        user_profile.bio = bio

        user.save()
        user_profile.save()

        response = {
            "id": user.id,
            "email": user.email,
            "first_name": user.userprofile.first_name,
            "last_name": user.userprofile.last_name,
            "bio": user.userprofile.bio
        }

        return Response(response, status=200)

    def delete(self, request):
        """Deletes a user"""
        password = request.data.get("password")
        user = request.user

        if not password or not user.check_password(password):
            return Response({"detail": "Invalid credentials"}, status=400)
        
        user.delete()
        return Response({"detail": "User deleted successfully"}, status=204)

class TaskListView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Task.objects.filter(
            is_deleted=False
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            modified_by=self.request.user,
        )

class TaskView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Task.objects.filter(
            is_deleted=False
        ).distinct()

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)

class ProjectListView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Project.objects.filter(
            users=self.request.user,
            is_deleted=False
        ).order_by("-id").distinct()

    def perform_create(self, serializer):
        project = serializer.save(
            created_by=self.request.user,
            modified_by=self.request.user,
        )
        project.users.add(self.request.user)

class ProjectView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Project.objects.filter(
            users=self.request.user,
            is_deleted=False
        ).distinct()

    def perform_update(self, serializer):
        serializer.save(modified_by=self.request.user)

class ProjectTaskListView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        project_id = self.kwargs["pk"]
        
        queryset = Task.objects.filter(
            project__id=project_id,
            project__users=self.request.user,
            is_deleted=False)
        return queryset.distinct()

    def perform_create(self, serializer):
        project_id = self.kwargs["pk"]
        project = Project.objects.get(id=project_id)

        serializer.save(
            project=project,
            created_by=self.request.user,
            modified_by=self.request.user,
        )

class ProjectTaskBacklogListView(generics.ListAPIView):
    """Lists all tasks in the product backlog"""
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        project_id = self.kwargs["pk"]
        
        queryset = Task.objects.filter(
            project__id=project_id,
            project__users=self.request.user,
            sprint=None,
            completed=False,
            is_deleted=False)
        return queryset.distinct()

class SprintListView(generics.ListCreateAPIView):
    serializer_class = SprintSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Sprint.objects.filter(
            project_id=self.kwargs["project_id"],
            project__users=self.request.user,
            is_deleted=False,
        ).distinct()

    def create(self, request, *args, **kwargs):
        project_id = self.kwargs.get("project_id")

        project = Project.objects.filter(
            id=project_id,
            users=request.user,
            is_deleted=False,
        ).first()

        if not project:
            return Response(
                {"detail": "Project not found or access denied"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(
            project=project,
            created_by=request.user,
            modified_by=request.user,
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class SprintView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SprintSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Sprint.objects.filter(
            id=self.kwargs["pk"],
            project_id=self.kwargs["project_id"],
            project__users=self.request.user,
            is_deleted=False
        ).distinct()
    
    def handle_incomplete_tasks(self, sprint_id: str, task_incomplete_behavior: Sprint.IncompleteTaskBehavior):
        """Handles incomplete tasks when a sprint is closed or completed"""
        incomplete_tasks=Task.objects.filter(sprint__id=sprint_id,completed=False)
        if task_incomplete_behavior == str(Sprint.IncompleteTaskBehavior.COMPLETE_TASKS):
            # Mark all tasks as complete
            incomplete_tasks.update(completed=True,status=Task.Status.DONE)
        elif task_incomplete_behavior == str(Sprint.IncompleteTaskBehavior.MOVE_TO_BACKLOG):
            # Move all incomplete tasks to backlog
            incomplete_tasks.update(sprint=None)
            # Delete all incomplete tasks
        elif task_incomplete_behavior == Sprint.IncompleteTaskBehavior.DELETE_TASKS:
            incomplete_tasks.delete()

    def perform_update(self, serializer):
        sprint_id=self.kwargs.get("pk")
        sprint = Sprint.objects.get(id=sprint_id)

        # If we're setting the sprint to completed, we need the completion behavior
        if sprint.completed == False and serializer.validated_data["completed"] == True:
            try:
                # Get the incomplete task behavior parameter
                task_incomplete_behavior_param = serializer.validated_data["on_incomplete_tasks"]
                task_incomplete_behavior = Sprint.IncompleteTaskBehavior(task_incomplete_behavior_param)
            except Exception:
                raise ValidationError("A valid behavior for incomplete tasks must be specified")
            
            self.handle_incomplete_tasks(sprint_id=sprint_id, task_incomplete_behavior=task_incomplete_behavior)
        
        # Set modified by
        serializer.save(modified_by=self.request.user)
    
    def perform_destroy(self, serializer):
        sprint_id=self.kwargs.get("pk")

        try:
            # Get the incomplete task behavior parameter
            request=self.get_serializer_context()["request"]
            task_incomplete_behavior_param = request.query_params["on_incomplete_tasks"]
            task_incomplete_behavior = Sprint.IncompleteTaskBehavior(task_incomplete_behavior_param)
        except Exception:
            raise ValidationError("A valid behavior for incomplete tasks must be specified")

        self.handle_incomplete_tasks(sprint_id=sprint_id, task_incomplete_behavior=task_incomplete_behavior)
        serializer.delete()

class SprintTaskListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Task.objects.filter(
            project_id=self.kwargs["project_id"],
            sprint_id=self.kwargs["sprint_id"],
            project__users=self.request.user,
            is_deleted=False,
        ).distinct()
    
class MyTaskListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Task.objects.filter(
            assigned_to=self.request.user,
            project__users=self.request.user,
            is_deleted=False,
        ).distinct()
    
class ProjectUserManageView(APIView): 
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk): 
        try:
            project = Project.objects.get(id=pk, users=request.user)
            user_id = request.data.get("user_id")
            user = User.objects.get(id=user_id)

            project.users.add(user)

            return Response({"detail":"User added to project"}, status=200)
        except Project.DoesNotExist:
            return Response({"detail":"Project not found or access denied"}, status=404)
        except User.DoesNotExist:
            return Response({"detail":"User not found"}, status=404)

    