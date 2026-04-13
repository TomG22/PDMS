from django.test import tag
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project, Sprint
from datetime import date, timedelta

class SprintCreateTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.create_user()
        cls.project = Project.objects.create(name="Test Project", description="This is a test project", created_by=cls.user, modified_by=cls.user)
        cls.project.users.add(cls.user)

        # Set up the test sprint to be used
        cls.sprint_data = {
            "name": "test sprint",
            "project": cls.project.id,
            "start_date": str(date.today()),
            "end_date": str(date.today() + timedelta(days=21)),
            "completed": "false"
        }

    @tag("sprint")
    def test_create_sprint_returns_201(self):
        response = self.client.post(f"/api/projects/{self.project.id}/sprints/", self.sprint_data, format="json")
        self.assertEqual(response.status_code, 201)

    @tag("sprint")
    def test_created_sprint_is_retrievable(self):
        response = self.client.post(f"/api/projects/{self.project.id}/sprints/", self.sprint_data, format="json")
        id = response.data["id"]

        stored_sprint = Sprint.objects.get(id=id)
        self.assertEqual(stored_sprint.name, self.sprint_data["name"])
        self.assertEqual(stored_sprint.project.id, self.sprint_data["project"])
        self.assertEqual(str(stored_sprint.start_date), self.sprint_data["start_date"])
        self.assertEqual(str(stored_sprint.end_date), self.sprint_data["end_date"])
