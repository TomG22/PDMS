from django.test import tag
from api.models import Project
from api.tests.base import AuthenticatedAPITestCase


class ProjectDeleteTests(AuthenticatedAPITestCase):
    def setUp(self):
        super().setUp()
        self.project = Project.objects.create(name="project 1", description="this is the first project", created_by=self.user, modified_by=self.user)
        self.project.users.add(self.user)

    @tag("project")
    def test_delete_project_returns_204(self):
        response = self.client.delete(f"/api/projects/{self.project.id}/")
        self.assertEqual(response.status_code, 204)

    @tag("project")
    def test_deleted_project_is_absent(self):
        self.client.delete(f"/api/projects/{self.project.id}/")
        self.assertEqual(Project.objects.filter(id=self.project.id).count(), 0)
