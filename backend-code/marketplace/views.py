from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import Listing
from .serializers import serialize_listing


@require_GET
def item_list(request):
    listings = Listing.objects.filter(is_active=True).select_related("category", "seller")

    data = [serialize_listing(request, listing) for listing in listings]
    return JsonResponse({"items": data, "count": len(data)})
