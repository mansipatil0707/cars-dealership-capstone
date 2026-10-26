import json

from django.contrib.auth.models import User
from django.test import TestCase


class AuthTests(TestCase):
    def setUp(self):
        User.objects.create_user(username="testuser", password="Passw0rd!123")

    def test_login_success(self):
        response = self.client.post(
            "/djangoapp/login",
            data=json.dumps({"userName": "testuser", "password": "Passw0rd!123"}),
            content_type="application/json",
        )
        self.assertEqual(response.json()["status"], "Authenticated")

    def test_login_failure(self):
        response = self.client.post(
            "/djangoapp/login",
            data=json.dumps({"userName": "testuser", "password": "wrong"}),
            content_type="application/json",
        )
        self.assertNotIn("status", response.json())

    def test_logout(self):
        response = self.client.get("/djangoapp/logout")
        self.assertEqual(response.json(), {"userName": ""})

    def test_get_cars(self):
        response = self.client.get("/djangoapp/get_cars")
        self.assertIn("CarModels", response.json())
        self.assertGreater(len(response.json()["CarModels"]), 0)
