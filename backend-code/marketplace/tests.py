import json

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from marketplace.models import Category, Listing
from users.jwt import create_auth_tokens
from users.models import UserProfile

User = get_user_model()


class ListingMutationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="seller1",
            email="seller1@example.com",
            password="secret-pass",
        )
        UserProfile.objects.get_or_create(user=self.user)
        self.other_user = User.objects.create_user(
            username="seller2",
            email="seller2@example.com",
            password="secret-pass",
        )
        UserProfile.objects.get_or_create(user=self.other_user)
        self.category = Category.objects.create(
            name="Books & Notes",
            description="Course books and notes",
        )
        self.access_token = create_auth_tokens(self.user)["access"]

    def test_create_listing_requires_authentication(self):
        response = self.client.post(
            reverse("item-create"),
            data=json.dumps({}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 401)

    def test_authenticated_user_can_create_listing(self):
        response = self.client.post(
            reverse("item-create"),
            data=json.dumps(
                {
                    "title": "Linear Algebra Textbook",
                    "category_id": self.category.id,
                    "price": "12.50",
                    "condition": "Good",
                    "pickup_location": "Main campus library",
                    "description": "Clean copy with highlights.",
                }
            ),
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {self.access_token}",
        )

        self.assertEqual(response.status_code, 201)
        listing = Listing.objects.get(title="Linear Algebra Textbook")
        self.assertEqual(listing.seller, self.user)

    def test_user_can_delete_own_listing(self):
        listing = Listing.objects.create(
            category=self.category,
            seller=self.user,
            title="Desk lamp",
            price="9.00",
            condition="Good",
            pickup_location="North campus",
        )

        response = self.client.delete(
            reverse("item-delete", args=[listing.id]),
            HTTP_AUTHORIZATION=f"Bearer {self.access_token}",
        )

        self.assertEqual(response.status_code, 200)
        self.assertFalse(Listing.objects.filter(id=listing.id).exists())

    def test_user_cannot_delete_someone_elses_listing(self):
        listing = Listing.objects.create(
            category=self.category,
            seller=self.other_user,
            title="Monitor stand",
            price="7.00",
            condition="Very good",
            pickup_location="South campus",
        )

        response = self.client.delete(
            reverse("item-delete", args=[listing.id]),
            HTTP_AUTHORIZATION=f"Bearer {self.access_token}",
        )

        self.assertEqual(response.status_code, 403)
