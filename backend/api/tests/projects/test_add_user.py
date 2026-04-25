from django.test import tag
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project
from django.contrib.auth.models import User


class ProjectAddUsersTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        # first user with project 
        cls.create_user()
        cls.project_data = {
            "name": "test project",
            "description": "test project"
        }
        cls.expected_project_slug = "test-project"

        # create second user
        cls.new_user = User.objects.create_user(
            username="newuser@test.com",
            email="newuser@test.com",
            password="1234"
        )
        
    @tag("project")
    def test_add_user_to_project(self): 
        response = self.client.post("/api/projects/", self.project_data, format="json")
        project_id = response.data["id"]

        url = f"/api/projects/{project_id}/users/"
        response = self.client.post(url, {"user_email":self.new_user.email}, format="json")

        self.assertEqual(response.status_code, 200)

        project = Project.objects.get(id=project_id)
        self.assertTrue(project.users.filter(id=self.new_user.id).exists())


    @tag("project")
    def test_project_does_not_exist(self): 
        fake_id = 999999999
        url = f"/api/projects/{fake_id}/users/"
        response = self.client.post(url, {"user_email":self.new_user.email}, format="json")

        self.assertEqual(response.status_code, 404)

        self.assertEqual(response.data["detail"], "Project not found or access denied")

    @tag("project")
    def test_user_does_not_exist(self): 
        response = self.client.post("/api/projects/", self.project_data, format="json")
        project_id = response.data["id"]

        url = f"/api/projects/{project_id}/users/"
        response = self.client.post(url, {"user_email":"fake@example.com"}, format="json")

        self.assertEqual(response.status_code, 404)

        self.assertEqual(response.data["detail"], "User not found")