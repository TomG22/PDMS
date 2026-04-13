from django.test import tag
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project, Sprint
from datetime import date, timedelta


class SprintDeleteTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.create_user()
        cls.project = Project.objects.create(name="Test Project", description="This is a test project", created_by=cls.user, modified_by=cls.user)
        cls.project.users.add(cls.user)

    def setUp(self):
        super().setUp()
        self.sprint = Sprint.objects.create(name="sprint a", project=self.project, start_date=str(date.today()),
            end_date=str(date.today() + timedelta(days=21)), created_by=self.user, modified_by=self.user)

    @tag("sprint")
    def test_delete_sprint_returns_204(self):
        response = self.client.delete(f"/api/projects/{self.project.id}/sprints/{self.sprint.id}/")
        self.assertEqual(response.status_code, 204)

    @tag("sprint")
    def test_deleted_sprint_is_absent(self):
        self.client.delete(f"/api/projects/{self.project.id}/sprints/{self.sprint.id}/")
        self.assertEqual(Sprint.objects.filter(id=self.sprint.id).count(), 0)
