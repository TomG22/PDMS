from django.test import tag
from api.tests.base import AuthenticatedAPITestCase


class TaskDeleteTests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        response = self.client.post(
            "/api/tasks/",
            {"name": "task a", "description": "this is task a", "completed": "false"},
            format="json",
        )
        self.task_id = response.data["id"]

    @tag("task")
    def test_delete_task_returns_204(self):
        response = self.client.delete(f"/api/tasks/{self.task_id}/")
        self.assertEqual(response.status_code, 204)

    @tag("task")
    def test_deleted_task_returns_404(self):
        self.client.delete(f"/api/tasks/{self.task_id}/")
        response = self.client.get(f"/api/tasks/{self.task_id}/")
        self.assertEqual(response.status_code, 404)
