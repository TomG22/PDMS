from django.urls import path
from .views import TaskListView, ProjectListView, ProjectView

urlpatterns = [
    path("tasks/", TaskListView.as_view(), name="tasks"),

    # api/projects/ - GET, POST
    path("projects/", ProjectListView.as_view(), name="projects"),

    # api/projects/<int:pk>/ - GET, PUT, DELETE
    path("projects/<int:pk>/", ProjectView.as_view(), name="project-detail"),

    # api/projects/<int:pk>/<slug:slug>/ - GET, PUT, DELETE
    # still uses pk to find the project, slug just makes url look nicer
    path("projects/<int:pk>/<slug:slug>/", ProjectView.as_view(), name="project-detail-slug"),
]
