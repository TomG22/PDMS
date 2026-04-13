from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from .views import (
    MyTaskListView, ProjectListView, ProjectView, ProjectTaskListView, SprintTaskListView,
    TaskListView, TaskView,
    SprintListView, SprintView,
    UserLogoutAPIView, UserRegisterAPIView,
    UserView
)

urlpatterns = [
    # JWT token endpoints (see https://medium.com/@aayushtcp/implementing-jwt-authentication-with-django-and-react-68fe92468873)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Auth endpoints
    path('logout/', UserLogoutAPIView.as_view(), name="logout"),
    path('register/', UserRegisterAPIView.as_view(), name="register"),
    path('user/', UserView.as_view(), name="user"),

    ### Task Endpoints ###

    # api/tasks/ - GET, POST
    path("tasks/", TaskListView.as_view(), name="tasks"),

    # api/tasks/<int:pk>/ - GET, PUT, PATCH, DELETE
    path("tasks/<int:pk>/", TaskView.as_view(), name="task-detail"),

    ### Project Endpoints ###

    # api/projects/ - GET, POST
    path("projects/", ProjectListView.as_view(), name="projects"),

    # api/projects/<int:project_id>/sprints/ - GET, POST
    path("projects/<int:project_id>/sprints/", SprintListView.as_view(), name="project-sprints"),

    # api/projects/<int:project_id>/sprints/<int:pk>/ - GET, PUT, PATCH, DELETE
    path("projects/<int:project_id>/sprints/<int:pk>/", SprintView.as_view(), name="project-sprint-detail"),

    # api/projects/<int:pk>/ - GET, PUT, PATCH, DELETE
    path("projects/<int:pk>/", ProjectView.as_view(), name="project-detail"),

    # api/projects/<int:pk>/<slug:slug>/ - GET, PUT, PATCH, DELETE
    # still uses pk to find the project, slug just makes url look nicer
    path("projects/<int:pk>/<slug:slug>/", ProjectView.as_view(), name="project-detail-slug"),

    # api/projects/<int:pk>/tasks - GET
    path("projects/<int:pk>/tasks/", ProjectTaskListView.as_view(), name="project-tasks"),

    # api/projects/<int:project_id>/sprints/<int:sprint_id>/tasks - GET
    path("projects/<int:project_id>/sprints/<int:sprint_id>/tasks/", SprintTaskListView.as_view(), name="sprint-tasks"),

    # api/tasks/my/ - GET
    path("tasks/my/", MyTaskListView.as_view(), name="my-tasks"),



    ]
