from django.test import tag
from api.models import Project, Task
from api.tests.base import AuthenticatedAPITestCase


class ProjectListTasksTests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.project_one = Project.objects.create(name="project 1", description="this is the first project", created_by=self.user, modified_by=self.user)
        self.project_one.users.add(self.user)
        self.project_two = Project.objects.create(name="project 2", description="this is the second project", created_by=self.user, modified_by=self.user)
        self.project_two.users.add(self.user)
        self.project_three = Project.objects.create(name="project 3", description="this is the third project", created_by=self.user, modified_by=self.user)
        self.project_three.users.add(self.user)

        self.task_one = Task.objects.create(name="task one", description="This is task one", completed=False, project=self.project_one, created_by=self.user, modified_by=self.user)
        self.task_one.users.add(self.user)
        self.task_two = Task.objects.create(name="task two", description="This is task two", completed=False, project=self.project_one, created_by=self.user, modified_by=self.user)
        self.task_two.users.add(self.user)
        self.task_three = Task.objects.create(name="task three", description="This is task three", completed=False, project=self.project_two, created_by=self.user, modified_by=self.user)
        self.task_three.users.add(self.user)
    
    @tag("project")
    def test_two_tasks(self):
        response = self.client.get(f"/api/projects/{self.project_one.id}/tasks")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        ids = [task["id"] for task in response.data]
        ids.sort()
        self.assertEqual(ids, [self.task_one.id, self.task_two.id])
    
    @tag("project")
    def test_one_task(self):
        response = self.client.get(f"/api/projects/{self.project_two.id}/tasks")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual([task["id"] for task in response.data], [self.task_three.id])
    
    @tag("project")
    def test_no_tasks(self):
        response = self.client.get(f"/api/projects/{self.project_three.id}/tasks")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])