from django.test import tag
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project, Task


class TaskCreateTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.create_user()
        cls.project = Project.objects.create(name="Test Project", description="This is a test project", created_by=cls.user, modified_by=cls.user)
        cls.project.users.add(cls.user)

        cls.task_data = {
            "name": "test",
            "description": "test task",
            "completed": "false",
            "project": cls.project.id
        }
    
    @tag("task")
    def test_create_task_returns_201(self):
        response = self.client.post("/api/tasks/", self.task_data, format="json")
        self.assertEqual(response.status_code, 201)

    @tag("task")
    def test_created_task_is_retrievable(self):
        response = self.client.post("/api/tasks/", self.task_data, format="json")
        id = response.data["id"]

        stored_task = Task.objects.get(id=id)
        self.assertEqual(stored_task.name, self.task_data["name"])
        self.assertEqual(stored_task.description, self.task_data["description"])
        self.assertEqual(stored_task.completed, False)
        self.assertEqual(stored_task.project.id, self.project.id)
