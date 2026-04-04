from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient


class AuthenticatedAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="test@test.com", password="password", email="test@test.com")

    def setUp(self):
        self.client = APIClient()
        response = self.client.post("/api/token/", {"username": "test@test.com", "password": "password"})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')
