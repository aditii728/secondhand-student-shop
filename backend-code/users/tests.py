import json

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.test import TestCase
from django.urls import reverse

from .jwt import decode_token
from .models import UserProfile
from .signals import create_user_profile, ensure_user_profile

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
        post_save.disconnect(create_user_profile, sender=User)
        post_save.disconnect(ensure_user_profile, sender=User)
        self.addCleanup(post_save.connect, create_user_profile, sender=User)
        self.addCleanup(post_save.connect, ensure_user_profile, sender=User)

        response = self.client.post(
            self.url,
            data=json.dumps(self.payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        user = User.objects.get(username="student_one")
        self.assertTrue(UserProfile.objects.filter(user=user).exists())


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
