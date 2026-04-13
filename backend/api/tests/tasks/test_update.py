from django.test import tag
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project, Task


class TaskUpdateTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.create_user()
        cls.project = Project.objects.create(name="Test Project", description="This is a test project", created_by=cls.user, modified_by=cls.user)
        cls.project.users.add(cls.user)

    def setUp(self):
        super().setUp()
        self.task = Task.objects.create(name="task a", description="This is task a", completed=False, project=self.project, created_by=self.user, modified_by=self.user)

    @tag("task")
    def test_update_task_returns_200(self):
        task = self.client.get(f"/api/tasks/{self.task.id}/").data
        task["completed"] = True
        response = self.client.put(f"/api/tasks/{self.task.id}/", task, format="json")
        self.assertEqual(response.status_code, 200)

    @tag("task")
    def test_update_task_persists(self):
        task = self.client.get(f"/api/tasks/{self.task.id}/").data
        task["completed"] = True
        self.client.put(f"/api/tasks/{self.task.id}/", task, format="json")

        updated_task = Task.objects.get(id=self.task.id)
        self.assertEqual(updated_task.completed, True)
    
    @tag("task")
    def test_update_task_priority(self):
        task = self.client.get(f"/api/tasks/{self.task.id}/").data
        task["priority"] = Task.Priority.HIGH
        self.client.put(f"/api/tasks/{self.task.id}/", task, format="json")

        updated_task = Task.objects.get(id=self.task.id)
        self.assertEqual(updated_task.priority, Task.Priority.HIGH)
    
    @tag("task")
    def test_update_task_status(self):
        task = self.client.get(f"/api/tasks/{self.task.id}/").data
        task["status"] = str(Task.Status.IN_PROGRESS)

        self.client.put(f"/api/tasks/{self.task.id}/", task, format="json")

        updated_task = Task.objects.get(id=self.task.id)
        self.assertEqual(updated_task.status, str(Task.Status.IN_PROGRESS))
