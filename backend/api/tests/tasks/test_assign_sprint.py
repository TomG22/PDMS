from django.test import tag
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project, Sprint, Task
from datetime import date, timedelta


class TaskUpdateTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.create_user()
        cls.project = Project.objects.create(name="Test Project", description="This is a test project", created_by=cls.user, modified_by=cls.user)
        cls.project.users.add(cls.user)
        cls.sprint_one = Sprint.objects.create(name="sprint one", project=cls.project, start_date=str(date.today()),
            end_date=str(date.today() + timedelta(days=21)), created_by=cls.user, modified_by=cls.user)
        cls.sprint_two = Sprint.objects.create(name="sprint two", project=cls.project, start_date=str(date.today()),
            end_date=str(date.today() + timedelta(days=21)), created_by=cls.user, modified_by=cls.user)

    def setUp(self):
        super().setUp()
        self.unassigned_task = Task.objects.create(name="unassigned task", description="This is an unassigned task", completed=False, project=self.project,
                                                   created_by=self.user, modified_by=self.user)
        self.assigned_task = Task.objects.create(name="assigned task", description="This is an assigned task", completed=False, project=self.project,
                                                 sprint=self.sprint_one, created_by=self.user, modified_by=self.user)
    
    @tag("task")
    def test_assign_task_to_sprint(self):
        task = self.client.get(f"/api/tasks/{self.unassigned_task.id}/").data
        task["sprint"] = self.sprint_one.id
        self.client.put(f"/api/tasks/{self.unassigned_task.id}/", task, format="json")

        # Test that sprint is set correctly
        updated_task = Task.objects.get(id=self.unassigned_task.id)
        self.assertEqual(updated_task.sprint.id, self.sprint_one.id)
  
    @tag("task")
    def test_reassign_task_to_sprint(self):
        task = self.client.get(f"/api/tasks/{self.assigned_task.id}/").data
        task["sprint"] = self.sprint_two.id
        self.client.put(f"/api/tasks/{self.assigned_task.id}/", task, format="json")

        # Test that sprint is set correctly
        updated_task = Task.objects.get(id=self.assigned_task.id)
        self.assertEqual(updated_task.sprint.id, self.sprint_two.id)

    @tag("task")
    def test_unassign_task_from_task(self):
        task = self.client.get(f"/api/tasks/{self.assigned_task.id}/").data
        task["sprint"] = None
        self.client.put(f"/api/tasks/{self.assigned_task.id}/", task, format="json")

        # Test that user is set correctly
        updated_task = Task.objects.get(id=self.assigned_task.id)
        self.assertEqual(updated_task.sprint, None)
