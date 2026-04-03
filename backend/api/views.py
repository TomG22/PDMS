from django.contrib.auth.models import User
from django.db import IntegrityError
import logging
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task, Project
from .serializers import TaskSerializer, ProjectSerializer

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
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")

        try:
            user = User.objects.create(username=username, email=email)
            user.set_password(password)
            user.save()
            return Response(
                {"detail": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        except KeyError as e:
            return Response({"detail": "Expected fields: (username, password, email)"},
                            status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as e:
            return Response({"detail": "Invalid or non-unique user given"},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error("Error while registering", e)
            return Response({"detail": "Unexpected server error"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDeleteAPIView(APIView):
    permission_classes = (IsAuthenticated,)

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
            users=self.request.user,
            is_deleted=False
        ).order_by("-id").distinct()

    def perform_create(self, serializer):
        task = serializer.save(
            created_by=self.request.user,
            modified_by=self.request.user,
        )
        task.users.add(self.request.user)

class TaskView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Task.objects.filter(
            users=self.request.user,
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
