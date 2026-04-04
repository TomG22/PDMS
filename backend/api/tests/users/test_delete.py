from django.test import tag
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from api.models import UserProfile
from api.tests.base import AuthenticatedAPITestCase


class UserDeleteTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="test@test.com", password="password", email="test@test.com")
        cls.user_profile = UserProfile.objects.create(
            user=cls.user, first_name="Test", last_name="User", bio="this is me"
        )

    def setUp(self):
        self.client = APIClient()
        response = self.client.post("/api/token/", {"username": "test@test.com", "password": "password"})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')

    @tag("user")
    def test_delete_user_returns_204(self):
        response = self.client.delete("/api/user/", {"password": "password"}, format="json")
        self.assertEqual(response.status_code, 204)

    @tag("user")
    def test_delete_user_with_wrong_password_returns_400(self):
        response = self.client.delete("/api/user/", {"password": "badpassword"}, format="json")
        self.assertEqual(response.status_code, 400)

    @tag("user")
    def test_deleted_user_cannot_authenticate(self):
        self.client.delete("/api/user/", {"password": "password"}, format="json")
        response = self.client.post("/api/token/", {"username": "test@test.com", "password": "password"})
        self.assertEqual(response.status_code, 401)
