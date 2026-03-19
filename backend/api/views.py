from rest_framework import generics
from .models import Task, Project
from .serializers import TaskSerializer, ProjectSerializer
from rest_framework.permissions import IsAuthenticated

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
