from django.test import tag
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project, Sprint
from datetime import date, timedelta


class SprintUpdateTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.create_user()
        cls.project = Project.objects.create(name="Test Project", description="This is a test project", created_by=cls.user, modified_by=cls.user)
        cls.project.users.add(cls.user)

    def setUp(self):
        super().setUp()
        self.sprint = Sprint.objects.create(name="sprint a", project=self.project, start_date=str(date.today()),
            end_date=str(date.today() + timedelta(days=21)), completed=False, created_by=self.user, modified_by=self.user)

    @tag("sprint")
    def test_update_sprint_returns_200(self):
        sprint = self.client.get(f"/api/projects/{self.project.id}/sprints/{self.sprint.id}/").data
        sprint["start_date"] = str(date.today() + timedelta(days=1))
        response = self.client.put(f"/api/projects/{self.project.id}/sprints/{self.sprint.id}/", sprint, format="json")
        self.assertEqual(response.status_code, 200)

    @tag("sprint")
    def test_update_sprint_persists(self):
        sprint = self.client.get(f"/api/projects/{self.project.id}/sprints/{self.sprint.id}/").data
        updated_date = date.today() + timedelta(days=1)
        sprint["start_date"] = str(updated_date)
        self.client.put(f"/api/projects/{self.project.id}/sprints/{self.sprint.id}/", sprint, format="json")

        updated_sprint = Sprint.objects.get(id=self.sprint.id)
        self.assertEqual(updated_sprint.start_date, updated_date)
