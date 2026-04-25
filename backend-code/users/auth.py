from django.contrib.auth import get_user_model

from .jwt import decode_token

User = get_user_model()


def get_bearer_token(request):
    auth_header = request.headers.get("Authorization", "")
    prefix = "Bearer "
    if not auth_header.startswith(prefix):
        return None
    return auth_header[len(prefix):].strip()


def get_authenticated_user(request):
    token = get_bearer_token(request)
    if not token:
        raise ValueError("Authentication credentials were not provided.")

    payload = decode_token(token, expected_type="access")

    try:
        return User.objects.get(id=payload["sub"])
    except User.DoesNotExist as exc:
        raise ValueError("User no longer exists.") from exc
