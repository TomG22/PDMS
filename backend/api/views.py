from rest_framework import generics
from .models import Task, Project
from .serializers import TaskSerializer, ProjectSerializer

class TaskListView(generics.ListCreateAPIView):
    queryset = Task.objects.all().order_by("-id")
    serializer_class = TaskSerializer

class ProjectListView(generics.ListCreateAPIView):
    queryset = Project.objects.all().order_by("-id")
    serializer_class = ProjectSerializer

class ProjectView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer