from django.test import tag
from api.tests.base import AuthenticatedAPITestCase


class TaskUpdateTests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        response = self.client.post(
            "/api/tasks/",
            {"name": "task a", "description": "this is task a", "completed": "false"},
            format="json",
        )
        self.task_id = response.data["id"]

    @tag("task")
    def test_update_task_returns_200(self):
        task = self.client.get(f"/api/tasks/{self.task_id}/").data
        task["completed"] = True
        response = self.client.put(f"/api/tasks/{self.task_id}/", task, format="json")
        self.assertEqual(response.status_code, 200)

    @tag("task")
    def test_update_task_persists(self):
        task = self.client.get(f"/api/tasks/{self.task_id}/").data
        task["completed"] = True
        self.client.put(f"/api/tasks/{self.task_id}/", task, format="json")

        updated = self.client.get(f"/api/tasks/{self.task_id}/").data
        self.assertEqual(updated["completed"], True)
