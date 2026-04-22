from django.contrib import admin

from .models import Category, Listing


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    ordering = ("name",)
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "description")


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "seller",
        "category",
        "price",
        "condition",
        "pickup_location",
        "is_featured",
        "is_active",
        "created_at",
    )
    list_filter = ("category", "condition", "is_featured", "is_active", "created_at")
    search_fields = (
        "title",
        "seller__username",
        "seller__first_name",
        "seller__last_name",
        "pickup_location",
        "description",
    )
    autocomplete_fields = ("category", "seller")
