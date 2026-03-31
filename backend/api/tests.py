from django.contrib.auth.models import User
from rest_framework.test import APITestCase, force_authenticate, APIClient

class TaskTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="test", password="password")

        # Log in
        response = self.client.post(path="/api/token/", data={"username": "test", "password": "password"})
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    
    def test_create_task(self):
        task_definition = {"name": "test", "description": "test task", "completed": "false"}
        response = self.client.post(path="/api/tasks/", data=task_definition, format="json")
        self.assertEqual(response.status_code, 201)
        id = response.data['id']

        # Retrieve the task
        response = self.client.get(path=f"/api/tasks/{id}/", format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(task_definition['name'], response.data['name'])
        self.assertEqual(task_definition['description'], response.data['description'])
        self.assertEqual(False, response.data['completed'])

class ProjectTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="test", password="password")

        # Log in
        response = self.client.post(path="/api/token/", data={"username": "test", "password": "password"})
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    
    def test_create_project(self):
        project_definition = {"name": "test project", "description": "test project"}
        response = self.client.post(path="/api/projects/", data=project_definition, format="json")
        self.assertEqual(response.status_code, 201)
        id = response.data['id']

        # Retrieve the task
        response = self.client.get(path=f"/api/projects/{id}/", format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(project_definition['name'], response.data['name'])
        self.assertEqual(project_definition['description'], response.data['description'])
        self.assertEqual('test-project', response.data['slug'])
