from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.test import TestCase

from .models import UserProfile
from .signals import ensure_user_profile

User = get_user_model()


class UserAdminTests(TestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username="admin_user",
            email="admin@example.com",
            password="admin-password-123",
        )
        self.client.force_login(self.admin_user)

    def test_change_page_loads_even_if_profile_is_missing(self):
        post_save.disconnect(ensure_user_profile, sender=User)
        self.addCleanup(post_save.connect, ensure_user_profile, sender=User)

        target_user = User.objects.create_user(
            username="user_without_profile",
            email="missing-profile@example.com",
            password="user-password-123",
        )

        self.assertFalse(UserProfile.objects.filter(user=target_user).exists())

        response = self.client.get(f"/admin/auth/user/{target_user.id}/change/", HTTP_HOST="localhost")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(UserProfile.objects.filter(user=target_user).exists())
