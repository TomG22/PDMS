from django.test import tag
from api.tests.base import AuthenticatedAPITestCase


class TaskCreateTests(AuthenticatedAPITestCase):
    @tag("task")
    def test_create_task_returns_201(self):
        task = {"name": "test", "description": "test task", "completed": "false"}
        response = self.client.post("/api/tasks/", task, format="json")
        self.assertEqual(response.status_code, 201)

    @tag("task")
    def test_created_task_is_retrievable(self):
        task = {"name": "test", "description": "test task", "completed": "false"}
        response = self.client.post("/api/tasks/", task, format="json")
        id = response.data["id"]

        response = self.client.get(f"/api/tasks/{id}/")
        self.assertEqual(response.data["name"], task["name"])
        self.assertEqual(response.data["description"], task["description"])
        self.assertEqual(response.data["completed"], False)
