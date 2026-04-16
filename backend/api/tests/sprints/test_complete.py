from django.test import tag
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project, Sprint, Task
from datetime import date, timedelta


class SprintCompleteTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.create_user()
        cls.project = Project.objects.create(name="Test Project", description="This is a test project", created_by=cls.user, modified_by=cls.user)
        cls.project.users.add(cls.user)

    def setUp(self):
        super().setUp()
        self.sprint = Sprint.objects.create(name="sprint a", project=self.project, start_date=str(date.today()),
                                            end_date=str(date.today() + timedelta(days=21)), created_by=self.user,
                                            modified_by=self.user)
        self.sprint_task_one = Task.objects.create(name="sprint task one", description="This is task one", completed=False,
                                                   sprint=self.sprint, status=Task.Status.IN_PROGRESS, project=self.project,
                                                   created_by=self.user, modified_by=self.user)
        self.sprint_task_two = Task.objects.create(name="sprint task two", description="This is task two", completed=False,
                                                   sprint=self.sprint, status=Task.Status.IN_PROGRESS, project=self.project,
                                                   created_by=self.user, modified_by=self.user)
        self.completed_sprint_task = Task.objects.create(name="completed sprint task", description="This is a completed task", 
                                                         completed=True, sprint=self.sprint, status=Task.Status.DONE,
                                                         project=self.project, created_by=self.user, modified_by=self.user)
        self.backlog_task_one = Task.objects.create(name="task three", description="This is task three", completed=False,
                                                    status=Task.Status.IN_PROGRESS, project=self.project, created_by=self.user,
                                                    modified_by=self.user)

    @tag("sprint")
    def test_completing_tasks_in_completed_sprint(self):
        sprint_data = self.client.get(f"/api/projects/{self.project.id}/sprints/{self.sprint.id}/").data
        sprint_data["completed"] = True
        sprint_data["on_incomplete_tasks"] = "complete"
        self.client.put(f"/api/projects/{self.project.id}/sprints/{self.sprint.id}/", sprint_data, format="json")
        
        # Confirm that no tasks were deleted
        self.assertEqual(Task.objects.count(), 4)

        # Confirm that the tasks were completed
        self.assertEqual(len(Task.objects.filter(sprint__id=self.sprint.id)), 3)
        sprint_task_one = Task.objects.get(id=self.sprint_task_one.id)
        self.assertEqual(sprint_task_one.completed, True)
        self.assertEqual(sprint_task_one.sprint.id, self.sprint.id)
        self.assertEqual(sprint_task_one.status, Task.Status.DONE)
        sprint_task_two = Task.objects.get(id=self.sprint_task_two.id)
        self.assertEqual(sprint_task_two.completed, True)
        self.assertEqual(sprint_task_two.sprint.id, self.sprint.id)
        self.assertEqual(sprint_task_two.status, Task.Status.DONE)

        # Confirm that the existing completed task is not removed from the sprint
        completed_sprint_task = Task.objects.get(id=self.completed_sprint_task.id)
        self.assertEqual(completed_sprint_task.sprint.id, self.sprint.id)
    
    @tag("sprint")
    def test_backlogging_tasks_in_completed_sprint(self):
        sprint_data = self.client.get(f"/api/projects/{self.project.id}/sprints/{self.sprint.id}/").data
        sprint_data["completed"] = True
        sprint_data["on_incomplete_tasks"] = "backlog"
        self.client.put(f"/api/projects/{self.project.id}/sprints/{self.sprint.id}/", sprint_data, format="json")
        
        # Confirm that no tasks were deleted
        self.assertEqual(Task.objects.count(), 4)

        # Confirm that the tasks were not completed but were removed from the sprint
        self.assertEqual(len(Task.objects.filter(sprint__id=self.sprint.id)), 1)
        sprint_task_one = Task.objects.get(id=self.sprint_task_one.id)
        self.assertEqual(sprint_task_one.completed, False)
        self.assertEqual(sprint_task_one.sprint, None)
        self.assertEqual(sprint_task_one.status, Task.Status.IN_PROGRESS)
        sprint_task_two = Task.objects.get(id=self.sprint_task_two.id)
        self.assertEqual(sprint_task_two.completed, False)
        self.assertEqual(sprint_task_two.sprint, None)
        self.assertEqual(sprint_task_two.status, Task.Status.IN_PROGRESS)

        # Confirm that the existing completed task is not removed from the sprint
        completed_sprint_task = Task.objects.get(id=self.completed_sprint_task.id)
        self.assertEqual(completed_sprint_task.sprint.id, self.sprint.id)