from django.test import tag
from api.models import Project, Sprint, Task
from api.tests.base import AuthenticatedAPITestCase
from datetime import date, timedelta


class ProductListTaskBacklog(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.project_one = Project.objects.create(name="project 1", description="this is the first project", created_by=self.user, modified_by=self.user)
        self.project_one.users.add(self.user)

        self.sprint_one = Sprint.objects.create(name="sprint 1", start_date=str(date.today()), end_date=str(date.today() + timedelta(days=21)),
                                                completed=False, project=self.project_one, created_by=self.user, modified_by=self.user)
        self.sprint_two = Sprint.objects.create(name="sprint 2", start_date=str(date.today()), end_date=str(date.today() + timedelta(days=21)),
                                                completed=False, project=self.project_one, created_by=self.user, modified_by=self.user)

        self.task_one = Task.objects.create(name="task one", description="This is task one", completed=False, sprint=self.sprint_one,
                                            project=self.project_one, created_by=self.user, modified_by=self.user)
        self.task_two = Task.objects.create(name="task two", description="This is task two", completed=False, sprint=self.sprint_one,
                                            project=self.project_one, created_by=self.user, modified_by=self.user)
        self.task_three = Task.objects.create(name="task three", description="This is task three", completed=False, sprint=self.sprint_two,
                                              project=self.project_one, created_by=self.user, modified_by=self.user)
        self.backlog_task_one = Task.objects.create(name="backlog task one", description="A backlogged task", completed=False,
                                                    project=self.project_one, created_by=self.user, modified_by=self.user)
        self.backlog_task_two = Task.objects.create(name="backlog task two", description="Another backlogged task", completed=False,
                                                    project=self.project_one, created_by=self.user, modified_by=self.user)
        self.completed_backlog_task = Task.objects.create(name="completed backlog task", description="Another backlogged task", completed=True,
                                                          project=self.project_one, created_by=self.user, modified_by=self.user)
    
    @tag("sprint")
    def test_backlog(self):
        response = self.client.get(f"/api/projects/{self.project_one.id}/tasks/backlog/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        ids = [task["id"] for task in response.data]
        ids.sort()
        self.assertEqual(ids, [self.backlog_task_one.id, self.backlog_task_two.id])
