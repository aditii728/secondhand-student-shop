import json

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.test import TestCase
from django.urls import reverse

from .jwt import decode_token
from .models import UserProfile
from .signals import ensure_user_profile

User = get_user_model()


class SignupViewTests(TestCase):
    def setUp(self):
        self.url = reverse("signup")
        self.payload = {
            "username": "student_one",
            "full_name": "Student One",
            "email": "student@example.com",
            "password": "A-strong-password-123",
            "university": "Example University",
            "phone_number": "+44 7700 900123",
        }

    def test_signup_creates_user_and_profile(self):
        response = self.client.post(
            self.url,
            data=json.dumps(self.payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        body = response.json()
        user = User.objects.get(username="student_one")
        profile = UserProfile.objects.get(user=user)
        self.assertEqual(profile.university, "Example University")
        self.assertEqual(profile.phone_number, "+447700900123")
        self.assertIn("tokens", body)
        self.assertEqual(decode_token(body["tokens"]["access"], expected_type="access")["sub"], str(user.id))

    def test_signup_still_succeeds_without_profile_signals(self):
        post_save.disconnect(ensure_user_profile, sender=User)
        self.addCleanup(post_save.connect, ensure_user_profile, sender=User)

        response = self.client.post(
            self.url,
            data=json.dumps(self.payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        user = User.objects.get(username="student_one")
        self.assertTrue(UserProfile.objects.filter(user=user).exists())

    def test_signup_rejects_invalid_json(self):
        response = self.client.post(
            self.url,
            data="{bad json",
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["errors"]["general"], "Send valid JSON.")

    def test_signup_rejects_duplicate_username_and_email(self):
        User.objects.create_user(
            username="student_one",
            email="student@example.com",
            password="existing-password",
        )

        response = self.client.post(
            self.url,
            data=json.dumps(self.payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        body = response.json()
        self.assertEqual(body["errors"]["username"], "That username is already taken.")
        self.assertEqual(body["errors"]["email"], "That email is already registered.")

    def test_signup_rejects_invalid_fields(self):
        response = self.client.post(
            self.url,
            data=json.dumps(
                {
                    "username": "x",
                    "full_name": "A",
                    "email": "not-an-email",
                    "password": "123456789",
                    "university": "",
                    "phone_number": "12",
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        body = response.json()
        self.assertIn("username", body["errors"])
        self.assertIn("full_name", body["errors"])
        self.assertIn("email", body["errors"])
        self.assertIn("university", body["errors"])
        self.assertIn("phone_number", body["errors"])
        self.assertIn("password", body["errors"])


class JwtAuthTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="auth_student",
            email="auth@example.com",
            password="secure-password-123",
            first_name="Auth",
            last_name="Student",
        )
        profile, _ = UserProfile.objects.get_or_create(user=self.user)
        profile.university = "Example University"
        profile.phone_number = "+441234567890"
        profile.save(update_fields=["university", "phone_number", "updated_at"])

    def test_login_returns_tokens_for_username(self):
        response = self.client.post(
            reverse("login"),
            data=json.dumps({"identifier": "auth_student", "password": "secure-password-123"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["user"]["email"], "auth@example.com")
        self.assertIn("tokens", body)
        self.assertEqual(decode_token(body["tokens"]["refresh"], expected_type="refresh")["sub"], str(self.user.id))

    def test_login_returns_tokens_for_email(self):
        response = self.client.post(
            reverse("login"),
            data=json.dumps({"identifier": "auth@example.com", "password": "secure-password-123"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)

    def test_login_rejects_short_identifier(self):
        response = self.client.post(
            reverse("login"),
            data=json.dumps({"identifier": "ab", "password": "secure-password-123"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()["errors"]["identifier"],
            "Enter your username or email address.",
        )

    def test_login_rejects_invalid_credentials(self):
        response = self.client.post(
            reverse("login"),
            data=json.dumps({"identifier": "auth_student", "password": "wrong-password"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json()["errors"]["general"],
            "Invalid username/email or password.",
        )

    def test_me_requires_valid_bearer_token(self):
        login_response = self.client.post(
            reverse("login"),
            data=json.dumps({"identifier": "auth_student", "password": "secure-password-123"}),
            content_type="application/json",
        )
        access_token = login_response.json()["tokens"]["access"]

        response = self.client.get(
            reverse("me"),
            HTTP_AUTHORIZATION=f"Bearer {access_token}",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["user"]["username"], "auth_student")

    def test_me_rejects_missing_bearer_token(self):
        response = self.client.get(reverse("me"))

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json()["errors"]["authorization"],
            "Authentication credentials were not provided.",
        )

    def test_refresh_returns_new_tokens(self):
        login_response = self.client.post(
            reverse("login"),
            data=json.dumps({"identifier": "auth_student", "password": "secure-password-123"}),
            content_type="application/json",
        )
        refresh_token = login_response.json()["tokens"]["refresh"]

        response = self.client.post(
            reverse("refresh-token"),
            data=json.dumps({"refresh": refresh_token}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("tokens", response.json())

    def test_refresh_rejects_invalid_token(self):
        response = self.client.post(
            reverse("refresh-token"),
            data=json.dumps({"refresh": "not-a-real-token"}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json()["errors"]["refresh"],
            "Invalid refresh token.",
        )
