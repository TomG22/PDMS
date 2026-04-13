from django.test import tag
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project


class ProjectCreateTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.create_user()
        cls.project_data = {
            "name": "test project",
            "description": "test project"
        }
        cls.expected_project_slug = "test-project"

    @tag("project")
    def test_create_project_returns_201(self):
        response = self.client.post("/api/projects/", self.project_data, format="json")
        self.assertEqual(response.status_code, 201)

    @tag("project")
    def test_created_project_is_retrievable(self):
        response = self.client.post("/api/projects/", self.project_data, format="json")
        id = response.data["id"]

        updated_project = Project.objects.get(id=id)
        self.assertEqual(updated_project.name, self.project_data["name"])
        self.assertEqual(updated_project.description, self.project_data["description"])

    @tag("project")
    def test_created_project_has_slug(self):
        response = self.client.post("/api/projects/", self.project_data, format="json")
        id = response.data["id"]

        updated_project = Project.objects.get(id=id)
        self.assertEqual(updated_project.slug, self.expected_project_slug)
