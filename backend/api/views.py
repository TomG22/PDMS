import logging
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task, Project
from .serializers import TaskSerializer, ProjectSerializer

logger = logging.getLogger(__name__)

class UserLogoutAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """Logs the user out"""
        try:
            request_data = request.data
            print(request_data)
            token = RefreshToken(request.data['refresh_token'])
            token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.error("Error while logging out", e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TaskListView(generics.ListCreateAPIView):
    queryset = Task.objects.all().order_by("-id")
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated,)

class ProjectListView(generics.ListCreateAPIView):
    queryset = Project.objects.all().order_by("-id")
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated,)

class ProjectView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated,)
