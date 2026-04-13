from django.test import tag
from api.models import Project, Sprint, Task
from api.tests.base import AuthenticatedAPITestCase
from datetime import date, timedelta


class SprintListTasksTests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.project_one = Project.objects.create(name="project 1", description="this is the first project", created_by=self.user, modified_by=self.user)
        self.project_one.users.add(self.user)

        self.sprint_one = Sprint.objects.create(name="sprint 1", start_date=str(date.today()), end_date=str(date.today() + timedelta(days=21)),
                                                completed=False, project=self.project_one, created_by=self.user, modified_by=self.user)
        self.sprint_two = Sprint.objects.create(name="sprint 2", start_date=str(date.today()), end_date=str(date.today() + timedelta(days=21)),
                                                completed=False, project=self.project_one, created_by=self.user, modified_by=self.user)
        self.sprint_three = Sprint.objects.create(name="sprint 3", start_date=str(date.today()), end_date=str(date.today() + timedelta(days=21)),
                                                  completed=False, project=self.project_one, created_by=self.user, modified_by=self.user)

        self.task_one = Task.objects.create(name="task one", description="This is task one", completed=False, sprint=self.sprint_one,
                                            project=self.project_one, created_by=self.user, modified_by=self.user)
        self.task_two = Task.objects.create(name="task two", description="This is task two", completed=False, sprint=self.sprint_one,
                                            project=self.project_one, created_by=self.user, modified_by=self.user)
        self.task_three = Task.objects.create(name="task three", description="This is task three", completed=False, sprint=self.sprint_two,
                                              project=self.project_one, created_by=self.user, modified_by=self.user)
    
    # TODO broken
    @tag("sprint")
    def test_two_tasks(self):
        response = self.client.get(f"/api/projects/{self.project_one.id}/sprints/{self.sprint_one.id}/tasks/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        ids = [task["id"] for task in response.data]
        ids.sort()
        self.assertEqual(ids, [self.task_one.id, self.task_two.id])
    
    # TODO broken
    @tag("sprint")
    def test_one_task(self):
        response = self.client.get(f"/api/projects/{self.project_one.id}/sprints/{self.sprint_two.id}/tasks/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual([task["id"] for task in response.data], [self.task_three.id])
    
    # TODO broken
    @tag("sprint")
    def test_no_tasks(self):
        response = self.client.get(f"/api/projects/{self.project_one.id}/sprints/{self.sprint_three.id}/tasks/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])