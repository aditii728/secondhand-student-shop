def serialize_listing(request, listing):
    image_url = ""
    if listing.image:
        image_url = request.build_absolute_uri(listing.image.url)

    return {
        "id": listing.id,
        "title": listing.title,
        "price": float(listing.price),
        "condition": listing.condition,
        "pickup_location": listing.pickup_location,
        "description": listing.description,
        "image_url": image_url,
        "image_alt": listing.image_alt,
        "is_featured": listing.is_featured,
        "category": {
            "id": listing.category.id,
            "name": listing.category.name,
            "slug": listing.category.slug,
        },
        "seller": {
            "id": listing.seller_id,
            "name": listing.seller_name,
        },
        "created_at": listing.created_at.isoformat(),
        "updated_at": listing.updated_at.isoformat(),
    }
