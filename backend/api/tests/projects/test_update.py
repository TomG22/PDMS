from django.test import tag
from api.tests.base import AuthenticatedAPITestCase


class ProjectUpdateTests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        response = self.client.post(
            "/api/projects/",
            {"name": "project 1", "description": "this is the first project"},
            format="json",
        )
        self.project_id = response.data["id"]

    @tag("project")
    def test_update_project_returns_200(self):
        project = self.client.get(f"/api/projects/{self.project_id}/").data
        project["description"] = "new description"
        response = self.client.put(f"/api/projects/{self.project_id}/", project, format="json")
        self.assertEqual(response.status_code, 200)

    @tag("project")
    def test_update_project_persists(self):
        project = self.client.get(f"/api/projects/{self.project_id}/").data
        project["description"] = "new description"
        self.client.put(f"/api/projects/{self.project_id}/", project, format="json")

        updated = self.client.get(f"/api/projects/{self.project_id}/").data
        self.assertEqual(updated["description"], "new description")
