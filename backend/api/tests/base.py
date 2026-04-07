from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient


class AuthenticatedAPITestCase(APITestCase):
    @classmethod
    def create_user(cls):
        cls.user = User.objects.create_user(username="test@test.com", password="password", email="test@test.com")
        
    @classmethod
    def setUpTestData(cls):
        """This method may be overridden; however, create_user() must be called to have an authenticated test"""
        cls.create_user()

    def setUp(self):
        self.client = APIClient()
        response = self.client.post("/api/token/", {"username": "test@test.com", "password": "password"})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')
