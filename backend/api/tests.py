from django.contrib.auth.models import User
from django.test import tag
from .models import UserProfile
from rest_framework.test import APITestCase, APIClient

class TaskTestCase(APITestCase):
    @classmethod
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="test", password="password")

        # Log in
        response = self.client.post(path="/api/token/", data={"username": "test", "password": "password"})
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # Create sample task
        task_definition = {"name": "task a", "description": "this is task a", "completed": "false"}
        response = self.client.post(path="/api/tasks/", data=task_definition, format="json")
    
    @tag("task")
    def test_create_task(self):
        """Creates a task using the API"""
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
    
    @tag("task")
    def test_update_task(self):
        """Updates a task using the API"""
        # Get initial task
        response = self.client.get(path="/api/tasks/1/", format="json")
        task_definition = response.data
        self.assertEqual(task_definition["completed"], False)

        # Update task
        task_definition["completed"] = True
        response = self.client.put(path="/api/tasks/1/", data=task_definition, format="json")
        self.assertEqual(response.status_code, 200)

        # Confirm that update persisted
        response = self.client.get(path="/api/tasks/1/", format="json")
        task_definition = response.data
        self.assertEqual(task_definition["completed"], True)
    
    @tag("task")
    def test_delete_task(self):
        """Deletes a task using the API"""
        # Delete existing task
        response = self.client.delete(path="/api/tasks/1/")
        self.assertEqual(response.status_code, 204)

        get_response = self.client.get(path="/api/tasks/1/")
        self.assertEqual(get_response.status_code, 404)

class ProjectTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="test", password="password")

        # Log in
        response = self.client.post(path="/api/token/", data={"username": "test", "password": "password"})
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # Create sample project
        project_definition = {"name": "project 1", "description": "this is the first project"}
        response = self.client.post(path="/api/projects/", data=project_definition, format="json")
    
    @tag("project")
    def test_create_project(self):
        project_definition = {"name": "test project", "description": "test project"}
        response = self.client.post(path="/api/projects/", data=project_definition, format="json")
        self.assertEqual(response.status_code, 201)
        id = response.data['id']

        # Retrieve the project
        response = self.client.get(path=f"/api/projects/{id}/", format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(project_definition['name'], response.data['name'])
        self.assertEqual(project_definition['description'], response.data['description'])
        self.assertEqual('test-project', response.data['slug'])
    
    @tag("project")
    def test_update_project(self):
        """Updates a project using the API"""
        # Get initial project
        response = self.client.get(path="/api/projects/1/", format="json")
        project_definition = response.data
        self.assertEqual(project_definition["description"], "this is the first project")

        # Update project
        new_description = "new description"
        project_definition["description"] = new_description
        response = self.client.put(path="/api/projects/1/", data=project_definition, format="json")
        self.assertEqual(response.status_code, 200)

        # Confirm that update persisted
        response = self.client.get(path="/api/projects/1/", format="json")
        project_definition = response.data
        self.assertEqual(project_definition["description"], new_description)
    
    @tag("project")
    def test_delete_project(self):
        """Deletes a project using the API"""
        # Delete existing project
        response = self.client.delete(path="/api/projects/1/")
        self.assertEqual(response.status_code, 204)

        get_response = self.client.get(path="/api/projects/1/")
        self.assertEqual(get_response.status_code, 404)

class UserTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="test", password="password", email="test@test.com")
        cls.user_profile = UserProfile.objects.create(user=cls.user, first_name="Test", last_name="User", bio="this is me")
    
    def setUp(self):
        # Log in
        self.client = APIClient()
        response = self.client.post(path="/api/token/", data={"username": "test", "password": "password"})
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    
    @tag("user")
    def test_get_user_profile(self):
        """Tests retrieving data from the user profile"""
        response = self.client.get(path="/api/user/", format="json")
        self.assertEqual(response.status_code, 200)

        # Check response data
        user_profile = response.data
        self.assertEqual(user_profile["email"], "test@test.com")
        self.assertEqual(user_profile["first_name"], "Test")
        self.assertEqual(user_profile["last_name"], "User")
        self.assertEqual(user_profile["bio"], "this is me")
    
    @tag("user")
    def test_update_user_profile(self):
        """Tests updating fields in the user's profile"""
        # Get existing user
        response = self.client.get(path="/api/user/", format="json")
        user_profile = response.data
        self.assertEqual(user_profile["email"], "test@test.com")

        # Update fields
        update_data = {
            "email": "test@test.org",
            "firstName": "NewTest",
            "lastName": "NewUser",
            "bio": "this is my new bio"
        }
        response = self.client.put(path="/api/user/", data=update_data, format="json")
        self.assertEqual(response.status_code, 200)

        # Check updated data fields
        updated_user_profile = response.data
        self.assertEqual(updated_user_profile["email"], "test@test.org")
        self.assertEqual(updated_user_profile["first_name"], "NewTest")
        self.assertEqual(updated_user_profile["last_name"], "NewUser")
        self.assertEqual(updated_user_profile["bio"], "this is my new bio")
