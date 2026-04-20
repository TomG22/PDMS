from django.test import tag
from django.contrib.auth.models import User
from api.tests.base import AuthenticatedAPITestCase
from api.models import Project, Sprint, Task
from datetime import date, timedelta


class TaskValidationTests(AuthenticatedAPITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.create_user()

        cls.project_one = Project.objects.create(
            name="Project One",
            description="First project",
            created_by=cls.user,
            modified_by=cls.user
        )
        cls.project_one.users.add(cls.user)

        cls.project_two = Project.objects.create(
            name="Project Two",
            description="Second project",
            created_by=cls.user,
            modified_by=cls.user
        )
        cls.project_two.users.add(cls.user)

        cls.project_one_sprint = Sprint.objects.create(
            name="Project One Sprint",
            project=cls.project_one,
            start_date=str(date.today()),
            end_date=str(date.today() + timedelta(days=21)),
            created_by=cls.user,
            modified_by=cls.user
        )

        cls.project_two_sprint = Sprint.objects.create(
            name="Project Two Sprint",
            project=cls.project_two,
            start_date=str(date.today()),
            end_date=str(date.today() + timedelta(days=21)),
            created_by=cls.user,
            modified_by=cls.user
        )

        cls.in_project = User.objects.create_user(
            username="in_project@test.com",
            email="in_project@test.com",
            password="password"
        )
        cls.project_one.users.add(cls.in_project)

        cls.not_in_project = User.objects.create_user(
            username="not_in_project@test.com",
            email="not_in_project@test.com",
            password="password"
        )

    def setUp(self):
        super().setUp()

        self.task = Task.objects.create(
            name="Test",
            description="description",
            completed=False,
            project=self.project_one,
            assigned_to=self.in_project,
            sprint=self.project_one_sprint,
            created_by=self.user,
            modified_by=self.user
        )

        self.unassigned_task = Task.objects.create(
            name="Unassigned Task",
            description="No user or sprint",
            completed=False,
            project=self.project_one,
            created_by=self.user,
            modified_by=self.user
        )

    @tag("task")
    def test_create_task_fails_if_assigned_user_not_in_project(self):
        payload = {
            "name": "Invalid",
            "description": "fails",
            "completed": False,
            "priority": 0,
            "status": "ready_to_begin",
            "project": self.project_one.id,
            "assigned_to": self.not_in_project.id,
            "sprint": self.project_one_sprint.id,
        }

        response = self.client.post("/api/tasks/", payload, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("assigned_to", response.data)
        self.assertEqual(
            response.data["assigned_to"][0],
            f"User {self.not_in_project.id} must be part of the project {self.project_one.id}"
        )

    @tag("task")
    def test_create_task_fails_if_sprint_not_in_same_project(self):
        payload = {
            "name": "Invalid",
            "description": "fails",
            "completed": False,
            "priority": 0,
            "status": "ready_to_begin",
            "project": self.project_one.id,
            "assigned_to": self.in_project.id,
            "sprint": self.project_two_sprint.id,
        }

        response = self.client.post("/api/tasks/", payload, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("sprint", response.data)
        self.assertEqual(
            str(response.data["sprint"][0]),
            f"Sprint {self.project_two_sprint.id} belongs to project {self.project_two.id}, but task belongs to project {self.project_one.id}"
        )

    @tag("task")
    def test_update_task_fails_if_reassigned_user_not_in_project(self):
        task = self.client.get(f"/api/tasks/{self.task.id}/").data
        task["assigned_to"] = self.not_in_project.id

        response = self.client.put(f"/api/tasks/{self.task.id}/", task, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("assigned_to", response.data)
        self.assertEqual(
            response.data["assigned_to"][0],
            f"User {self.not_in_project.id} must be part of the project {self.project_one.id}"
        )

    @tag("task")
    def test_update_task_fails_if_reassigned_sprint_not_in_same_project(self):
        task = self.client.get(f"/api/tasks/{self.task.id}/").data
        task["sprint"] = self.project_two_sprint.id

        response = self.client.put(f"/api/tasks/{self.task.id}/", task, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("sprint", response.data)
        self.assertEqual(
            str(response.data["sprint"][0]),
            f"Sprint {self.project_two_sprint.id} belongs to project {self.project_two.id}, but task belongs to project {self.project_one.id}"
        )

    @tag("task")
    def test_update_task_project_fails_if_existing_assigned_user_not_in_new_project(self):
        task = self.client.get(f"/api/tasks/{self.task.id}/").data
        task["project"] = self.project_two.id

        response = self.client.put(f"/api/tasks/{self.task.id}/", task, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("assigned_to", response.data)
        self.assertEqual(
            response.data["assigned_to"][0],
            f"User {self.in_project.id} must be part of the project {self.project_two.id}"
        )

    @tag("task")
    def test_update_task_project_fails_if_existing_sprint_not_in_new_project(self):
        task = self.client.get(f"/api/tasks/{self.unassigned_task.id}/").data
        task["sprint"] = self.project_one_sprint.id
        self.client.put(f"/api/tasks/{self.unassigned_task.id}/", task, format="json")

        updated_task_payload = self.client.get(f"/api/tasks/{self.unassigned_task.id}/").data
        updated_task_payload["project"] = self.project_two.id

        response = self.client.put(
            f"/api/tasks/{self.unassigned_task.id}/",
            updated_task_payload,
            format="json"
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("sprint", response.data)
        self.assertEqual(
            str(response.data["sprint"][0]),
            f"Sprint {self.project_one_sprint.id} belongs to project {self.project_one.id}, but task belongs to project {self.project_two.id}"
        )