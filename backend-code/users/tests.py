import json

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.test import TestCase
from django.urls import reverse

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
        user = User.objects.get(username="student_one")
        profile = UserProfile.objects.get(user=user)
        self.assertEqual(profile.university, "Example University")
        self.assertEqual(profile.phone_number, "+447700900123")

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
