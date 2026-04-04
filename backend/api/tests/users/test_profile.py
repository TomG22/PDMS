from django.test import tag
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from api.models import UserProfile
from api.tests.base import AuthenticatedAPITestCase


class UserProfileGetTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="test@test.com", password="password", email="test@test.com")
        cls.user_profile = UserProfile.objects.create(
            user=cls.user, first_name="Test", last_name="User", bio="this is me"
        )

    @tag("user")
    def test_get_user_profile_returns_200(self):
        response = self.client.get("/api/user/")
        self.assertEqual(response.status_code, 200)

    @tag("user")
    def test_get_user_profile_returns_correct_data(self):
        response = self.client.get("/api/user/")
        self.assertEqual(response.data["email"], "test@test.com")
        self.assertEqual(response.data["first_name"], "Test")
        self.assertEqual(response.data["last_name"], "User")
        self.assertEqual(response.data["bio"], "this is me")


class UserProfileUpdateTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="test2@test.com", password="password", email="test2@test.com")
        cls.user_profile = UserProfile.objects.create(
            user=cls.user, first_name="Test", last_name="User", bio="this is me"
        )

    def setUp(self):
        self.client = APIClient()
        response = self.client.post("/api/token/", {"username": "test2@test.com", "password": "password"})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')

    @tag("user")
    def test_update_user_profile_returns_200(self):
        update_data = {"email": "test2@test.org", "firstName": "NewTest", "lastName": "NewUser", "bio": "new bio"}
        response = self.client.put("/api/user/", update_data, format="json")
        self.assertEqual(response.status_code, 200)

    @tag("user")
    def test_update_user_profile_persists(self):
        update_data = {"email": "test2@test.org", "firstName": "NewTest", "lastName": "NewUser", "bio": "this is my new bio"}
        response = self.client.put("/api/user/", update_data, format="json")
        self.assertEqual(response.data["email"], "test2@test.org")
        self.assertEqual(response.data["first_name"], "NewTest")
        self.assertEqual(response.data["last_name"], "NewUser")
        self.assertEqual(response.data["bio"], "this is my new bio")
