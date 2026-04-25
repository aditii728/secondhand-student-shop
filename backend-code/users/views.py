import json

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import UserProfile

User = get_user_model()


def split_full_name(full_name):
    parts = full_name.strip().split(maxsplit=1)
    first_name = parts[0] if parts else ""
    last_name = parts[1] if len(parts) > 1 else ""
    return first_name, last_name


def normalize_phone_number(phone_number):
    allowed_characters = []
    for index, character in enumerate(phone_number.strip()):
        if character.isdigit():
            allowed_characters.append(character)
        elif character == "+" and index == 0:
            allowed_characters.append(character)
    return "".join(allowed_characters)


@csrf_exempt
@require_POST
def signup(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse(
            {"message": "Invalid request body.", "errors": {"general": "Send valid JSON."}},
            status=400,
        )

    username = payload.get("username", "").strip()
    full_name = payload.get("full_name", "").strip()
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    university = payload.get("university", "").strip()
    phone_number = payload.get("phone_number", "").strip()

    errors = {}

    if len(username) < 3 or not username.replace("_", "").isalnum():
        errors["username"] = (
            "Username must be at least 3 characters and use only letters, numbers, or underscores."
        )

    if len(full_name) < 2:
        errors["full_name"] = "Full name must be at least 2 characters long."

    if "@" not in email or "." not in email.split("@")[-1]:
        errors["email"] = "Enter a valid email address."

    if len(university) < 2:
        errors["university"] = "Enter your university name."

    normalized_phone_number = normalize_phone_number(phone_number)
    if len(normalized_phone_number.replace("+", "")) < 7:
        errors["phone_number"] = "Enter a valid phone number."

    if User.objects.filter(username__iexact=username).exists():
        errors["username"] = "That username is already taken."

    if User.objects.filter(email__iexact=email).exists():
        errors["email"] = "That email is already registered."

    candidate_user = User(username=username, email=email)
    try:
        validate_password(password, user=candidate_user)
    except ValidationError as exc:
        errors["password"] = " ".join(exc.messages)

    if errors:
        return JsonResponse(
            {"message": "Please correct the highlighted fields.", "errors": errors},
            status=400,
        )

    first_name, last_name = split_full_name(full_name)

    try:
        with transaction.atomic():
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.phone_number = normalized_phone_number
            profile.university = university
            profile.save(update_fields=["phone_number", "university", "updated_at"])
    except IntegrityError:
        if User.objects.filter(username__iexact=username).exists():
            errors["username"] = "That username is already taken."
        if User.objects.filter(email__iexact=email).exists():
            errors["email"] = "That email is already registered."

        if errors:
            return JsonResponse(
                {"message": "Please correct the highlighted fields.", "errors": errors},
                status=400,
            )
        raise

    return JsonResponse(
        {
            "message": "Account created successfully.",
            "user": {
                "id": user.id,
                "username": user.username,
                "full_name": user.get_full_name().strip() or user.username,
                "email": user.email,
                "phone_number": profile.phone_number,
                "university": profile.university,
            },
        },
        status=201,
    )
