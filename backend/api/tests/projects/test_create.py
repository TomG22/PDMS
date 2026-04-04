from django.test import tag
from api.tests.base import AuthenticatedAPITestCase


class ProjectCreateTests(AuthenticatedAPITestCase):
    @tag("project")
    def test_create_project_returns_201(self):
        project = {"name": "test project", "description": "test project"}
        response = self.client.post("/api/projects/", project, format="json")
        self.assertEqual(response.status_code, 201)

    @tag("project")
    def test_created_project_is_retrievable(self):
        project = {"name": "test project", "description": "test project"}
        response = self.client.post("/api/projects/", project, format="json")
        id = response.data["id"]

        response = self.client.get(f"/api/projects/{id}/")
        self.assertEqual(response.data["name"], project["name"])
        self.assertEqual(response.data["description"], project["description"])

    @tag("project")
    def test_created_project_has_slug(self):
        project = {"name": "test project", "description": "test project"}
        response = self.client.post("/api/projects/", project, format="json")
        id = response.data["id"]

        response = self.client.get(f"/api/projects/{id}/")
        self.assertEqual(response.data["slug"], "test-project")
