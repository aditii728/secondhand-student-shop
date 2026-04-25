from decimal import Decimal, InvalidOperation

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from users.auth import get_authenticated_user

from .models import Category, Listing
from .serializers import serialize_category, serialize_listing


@require_GET
def item_list(request):
    listings = Listing.objects.filter(is_active=True).select_related("category", "seller")

    data = [serialize_listing(request, listing) for listing in listings]
    return JsonResponse({"items": data, "count": len(data)})


@require_GET
def category_list(request):
    categories = Category.objects.all()
    data = [serialize_category(category) for category in categories]
    return JsonResponse({"items": data, "count": len(data)})


def parse_json_body(request):
    if request.content_type and request.content_type.startswith("multipart/form-data"):
        return request.POST, None

    try:
        import json

        return json.loads(request.body or "{}"), None
    except json.JSONDecodeError:
        return None, JsonResponse(
            {"message": "Invalid request body.", "errors": {"general": "Send valid JSON."}},
            status=400,
        )


@csrf_exempt
@require_http_methods(["POST"])
def create_listing(request):
    try:
        user = get_authenticated_user(request)
    except ValueError as exc:
        return JsonResponse(
            {"message": str(exc), "errors": {"authorization": str(exc)}},
            status=401,
        )

    payload, error_response = parse_json_body(request)
    if error_response:
        return error_response

    title = payload.get("title", "").strip()
    category_id = payload.get("category_id")
    condition = payload.get("condition", "").strip()
    pickup_location = payload.get("pickup_location", "").strip()
    description = payload.get("description", "").strip()
    image_alt = payload.get("image_alt", "").strip()
    price_raw = str(payload.get("price", "")).strip()
    image = request.FILES.get("image")

    errors = {}

    if len(title) < 3:
        errors["title"] = "Enter a listing title."

    try:
        category = Category.objects.get(id=category_id)
    except (Category.DoesNotExist, TypeError, ValueError):
        category = None
        errors["category_id"] = "Choose a valid category."

    if condition not in Listing.Condition.values:
        errors["condition"] = "Choose a valid item condition."

    if len(pickup_location) < 2:
        errors["pickup_location"] = "Enter a pickup location."

    try:
        price = Decimal(price_raw)
        if price < 0:
            raise InvalidOperation
    except (InvalidOperation, ValueError):
        price = None
        errors["price"] = "Enter a valid price."

    if errors:
        return JsonResponse(
            {"message": "Please correct the highlighted fields.", "errors": errors},
            status=400,
        )

    listing = Listing.objects.create(
        category=category,
        seller=user,
        title=title,
        price=price,
        condition=condition,
        pickup_location=pickup_location,
        description=description,
        image=image,
        image_alt=image_alt,
        is_active=True,
    )

    return JsonResponse(
        {
            "message": "Listing created successfully.",
            "item": serialize_listing(request, listing),
        },
        status=201,
    )


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_listing(request, listing_id):
    try:
        user = get_authenticated_user(request)
    except ValueError as exc:
        return JsonResponse(
            {"message": str(exc), "errors": {"authorization": str(exc)}},
            status=401,
        )

    try:
        listing = Listing.objects.get(id=listing_id, is_active=True)
    except Listing.DoesNotExist:
        return JsonResponse({"message": "Listing not found."}, status=404)

    if listing.seller_id != user.id:
        return JsonResponse(
            {"message": "You can only remove your own listings."},
            status=403,
        )

    listing.delete()
    return JsonResponse({"message": "Listing removed successfully."})
