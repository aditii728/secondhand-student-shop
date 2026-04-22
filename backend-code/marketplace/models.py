from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField()

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Listing(models.Model):
    class Condition(models.TextChoices):
        EXCELLENT = "Excellent", "Excellent"
        VERY_GOOD = "Very good", "Very good"
        GOOD = "Good", "Good"

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="listings",
    )
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="listings",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=200)
    price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    condition = models.CharField(
        max_length=20,
        choices=Condition.choices,
        default=Condition.GOOD,
    )
    pickup_location = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="listing_images/",
        blank=True,
        null=True,
    )
    image_alt = models.CharField(max_length=255, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "title"]

    @property
    def seller_name(self):
        if not self.seller:
            return ""

        full_name = self.seller.get_full_name().strip()
        return full_name or self.seller.username

    @property
    def image_url(self):
        return self.image.url if self.image else ""

    def __str__(self):
        return self.title
