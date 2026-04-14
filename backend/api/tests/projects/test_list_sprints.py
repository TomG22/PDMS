from django.test import tag
from api.models import Project, Sprint
from api.tests.base import AuthenticatedAPITestCase
from datetime import date, timedelta


class ProjectListSprintsTests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.project_one = Project.objects.create(name="project 1", description="this is the first project", created_by=self.user, modified_by=self.user)
        self.project_one.users.add(self.user)
        self.project_two = Project.objects.create(name="project 2", description="this is the second project", created_by=self.user, modified_by=self.user)
        self.project_two.users.add(self.user)
        self.project_three = Project.objects.create(name="project 3", description="this is the third project", created_by=self.user, modified_by=self.user)
        self.project_three.users.add(self.user)

        self.sprint_one = Sprint.objects.create(name="sprint one", start_date=str(date.today()), end_date=str(date.today() + timedelta(days=21)),
                                                completed=False, project=self.project_one, created_by=self.user, modified_by=self.user)
        self.sprint_two = Sprint.objects.create(name="sprint two", start_date=str(date.today()), end_date=str(date.today() + timedelta(days=21)),
                                                completed=True, project=self.project_one, created_by=self.user, modified_by=self.user)
        self.sprint_three = Sprint.objects.create(name="sprint three", start_date=str(date.today()), end_date=str(date.today() + timedelta(days=21)),
                                                  completed=False, project=self.project_two, created_by=self.user, modified_by=self.user)
    
    @tag("project")
    def test_two_sprints(self):
        response = self.client.get(f"/api/projects/{self.project_one.id}/sprints/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        ids = [sprint["id"] for sprint in response.data]
        ids.sort()
        self.assertEqual(ids, [self.sprint_one.id, self.sprint_two.id])
    
    @tag("project")
    def test_one_sprint(self):
        response = self.client.get(f"/api/projects/{self.project_two.id}/sprints/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual([sprint["id"] for sprint in response.data], [self.sprint_three.id])
    
    @tag("project")
    def test_no_sprints(self):
        response = self.client.get(f"/api/projects/{self.project_three.id}/sprints/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])