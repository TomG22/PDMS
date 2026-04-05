from django.test import tag
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project, Task


class TaskDeleteTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.create_user()
        cls.project = Project.objects.create(name="Test Project", description="This is a test project", created_by=cls.user, modified_by=cls.user)
        cls.project.users.add(cls.user)

    def setUp(self):
        super().setUp()
        self.task = Task.objects.create(name="task a", description="This is task a", completed=False, project=self.project, created_by=self.user, modified_by=self.user)
        self.task.users.add(self.user)

    @tag("task")
    def test_delete_task_returns_204(self):
        response = self.client.delete(f"/api/tasks/{self.task.id}/")
        self.assertEqual(response.status_code, 204)

    @tag("task")
    def test_deleted_task_is_absent(self):
        self.client.delete(f"/api/tasks/{self.task.id}/")
        self.assertEqual(Task.objects.filter(id=self.task.id).count(), 0)
