from django.urls import path

from .views import category_list, create_listing, delete_listing, item_list

urlpatterns = [
    path("categories/", category_list, name="category-list"),
    path("items/", item_list, name="item-list"),
    path("items/create/", create_listing, name="item-create"),
    path("items/<int:listing_id>/", delete_listing, name="item-delete"),
]
