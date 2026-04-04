from django.test import tag
from api.tests.base import AuthenticatedAPITestCase


class ProjectDeleteTests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        response = self.client.post(
            "/api/projects/",
            {"name": "project 1", "description": "this is the first project"},
            format="json",
        )
        self.project_id = response.data["id"]

    @tag("project")
    def test_delete_project_returns_204(self):
        response = self.client.delete(f"/api/projects/{self.project_id}/")
        self.assertEqual(response.status_code, 204)

    @tag("project")
    def test_deleted_project_returns_404(self):
        self.client.delete(f"/api/projects/{self.project_id}/")
        response = self.client.get(f"/api/projects/{self.project_id}/")
        self.assertEqual(response.status_code, 404)
