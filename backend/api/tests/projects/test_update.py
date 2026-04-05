from django.test import tag
from api.models import Project
from api.tests.base import AuthenticatedAPITestCase


class ProjectUpdateTests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.project = Project.objects.create(name="project 1", description="this is the first project", created_by=self.user, modified_by=self.user)
        self.project.users.add(self.user)

    @tag("project")
    def test_update_project_returns_200(self):
        project = self.client.get(f"/api/projects/{self.project.id}/").data
        project["description"] = "new description"
        response = self.client.put(f"/api/projects/{self.project.id}/", project, format="json")
        self.assertEqual(response.status_code, 200)

    @tag("project")
    def test_update_project_persists(self):
        project = self.client.get(f"/api/projects/{self.project.id}/").data
        project["description"] = "new description"
        self.client.put(f"/api/projects/{self.project.id}/", project, format="json")

        updated = self.client.get(f"/api/projects/{self.project.id}/").data
        self.assertEqual(updated["description"], "new description")
