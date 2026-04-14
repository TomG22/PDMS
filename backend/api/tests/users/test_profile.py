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
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["first_name"], self.user_profile.first_name)
        self.assertEqual(response.data["last_name"], self.user_profile.last_name)
        self.assertEqual(response.data["bio"], self.user_profile.bio)


class UserProfileUpdateTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="test2@test.com", password="password", email="test2@test.com")
        cls.user_profile = UserProfile.objects.create(
            user=cls.user, first_name="Test", last_name="User", bio="this is me"
        )

        cls.profile_data = {
            "email": "test2@test.org",
            "firstName": "NewTest",
            "lastName": "NewUser",
            "bio": "new bio"
        }

    def setUp(self):
        self.client = APIClient()
        response = self.client.post("/api/token/", {"username": "test2@test.com", "password": "password"})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')

    @tag("user")
    def test_update_user_profile_returns_200(self):
        response = self.client.put("/api/user/", self.profile_data, format="json")
        self.assertEqual(response.status_code, 200)

    @tag("user")
    def test_update_user_profile_persists(self):
        response = self.client.put("/api/user/", self.profile_data, format="json")
        id = response.data["id"]

        updated_user = User.objects.get(id=id)
        updated_profile = updated_user.userprofile
        self.assertEqual(updated_user.email, self.profile_data["email"])
        self.assertEqual(updated_profile.first_name, self.profile_data["firstName"])
        self.assertEqual(updated_profile.last_name, self.profile_data["lastName"])
        self.assertEqual(updated_profile.bio, self.profile_data["bio"])
