from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)
from .views import TaskListView, ProjectListView, ProjectView, UserLogoutAPIView, UserRegisterAPIView

urlpatterns = [
    # JWT token endpoints (see https://medium.com/@aayushtcp/implementing-jwt-authentication-with-django-and-react-68fe92468873)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Auth endpoints
    path('logout/', UserLogoutAPIView.as_view(), name="logout"),
    path('register/', UserRegisterAPIView.as_view(), name="logout"),

    path("tasks/", TaskListView.as_view(), name="tasks"),

    # api/projects/ - GET, POST
    path("projects/", ProjectListView.as_view(), name="projects"),

    # api/projects/<int:pk>/ - GET, PUT, DELETE
    path("projects/<int:pk>/", ProjectView.as_view(), name="project-detail"),

    # api/projects/<int:pk>/<slug:slug>/ - GET, PUT, DELETE
    # still uses pk to find the project, slug just makes url look nicer
    path("projects/<int:pk>/<slug:slug>/", ProjectView.as_view(), name="project-detail-slug")
]
