from django.contrib.auth.models import User
from django.test import tag
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project, Task


class TaskUpdateTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.create_user()
        cls.project = Project.objects.create(name="Test Project", description="This is a test project", created_by=cls.user, modified_by=cls.user)
        cls.project.users.add(cls.user)

        cls.another_user = User.objects.create_user(username="test2@test.com", password="password", email="test2@test.com")

    def setUp(self):
        super().setUp()
        self.unassigned_task = Task.objects.create(name="unassigned task", description="This is an unassigned task", completed=False, project=self.project,
                                                   created_by=self.user, modified_by=self.user)
        self.assigned_task = Task.objects.create(name="assigned task", description="This is an assigned task", completed=False, project=self.project,
                                                 assigned_to=self.user, created_by=self.user, modified_by=self.user)
    
    @tag("task")
    def test_assign_task_to_user(self):
        task = self.client.get(f"/api/tasks/{self.unassigned_task.id}/").data
        task["assigned_to"] = self.user.id
        self.client.put(f"/api/tasks/{self.unassigned_task.id}/", task, format="json")

        # Test that user is set correctly
        updated_task = Task.objects.get(id=self.unassigned_task.id)
        self.assertEqual(updated_task.assigned_to.id, self.user.id)

        # Test that username serializer field populates
        updated_task_result = self.client.get(f"/api/tasks/{self.unassigned_task.id}/").data
        self.assertEqual(updated_task_result["assigned_to_username"], self.user.username)

    # TODO broken    
    @tag("task")
    def test_reassign_task_to_user(self):
        task = self.client.get(f"/api/tasks/{self.assigned_task.id}/").data
        print(task)
        task["assigned_to"] = self.another_user.id
        print(task)
        self.client.put(f"/api/tasks/{self.assigned_task.id}/", task, format="json")

        # Test that user is set correctly
        updated_task = Task.objects.get(id=self.assigned_task.id)
        self.assertEqual(updated_task.assigned_to.id, self.another_user.id)

        # Test that username serializer field populates
        updated_task_result = self.client.get(f"/api/tasks/{self.assigned_task.id}/").data
        self.assertEqual(updated_task_result["assigned_to_username"], self.another_user.username)

    @tag("task")
    def test_unassign_task_from_user(self):
        task = self.client.get(f"/api/tasks/{self.assigned_task.id}/").data
        task["assigned_to"] = None
        self.client.put(f"/api/tasks/{self.assigned_task.id}/", task, format="json")

        # Test that user is set correctly
        updated_task = Task.objects.get(id=self.assigned_task.id)
        self.assertEqual(updated_task.assigned_to, None)

        # Test that username serializer field populates
        updated_task_result = self.client.get(f"/api/tasks/{self.assigned_task.id}/").data
        self.assertEqual(updated_task_result["assigned_to_username"], "")
