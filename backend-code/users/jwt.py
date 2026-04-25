import base64
import hashlib
import hmac
import json
import time
from datetime import timedelta

from django.conf import settings


def _b64url_encode(data):
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(data):
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(f"{data}{padding}")


def _sign(signing_input):
    return hmac.new(
        settings.SECRET_KEY.encode("utf-8"),
        signing_input.encode("ascii"),
        hashlib.sha256,
    ).digest()


def create_token(*, user, token_type, lifetime):
    now = int(time.time())
    payload = {
        "sub": str(user.id),
        "username": user.username,
        "type": token_type,
        "iat": now,
        "exp": now + int(lifetime.total_seconds()),
    }
    header = {"alg": "HS256", "typ": "JWT"}

    encoded_header = _b64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    encoded_payload = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{encoded_header}.{encoded_payload}"
    signature = _b64url_encode(_sign(signing_input))
    return f"{signing_input}.{signature}"


def decode_token(token, *, expected_type=None):
    try:
        encoded_header, encoded_payload, encoded_signature = token.split(".")
    except ValueError as exc:
        raise ValueError("Invalid token format.") from exc

    signing_input = f"{encoded_header}.{encoded_payload}"
    actual_signature = _sign(signing_input)
    expected_signature = _b64url_decode(encoded_signature)

    if not hmac.compare_digest(actual_signature, expected_signature):
        raise ValueError("Invalid token signature.")

    try:
        payload = json.loads(_b64url_decode(encoded_payload))
    except (json.JSONDecodeError, ValueError) as exc:
        raise ValueError("Invalid token payload.") from exc

    if payload.get("exp", 0) < int(time.time()):
        raise ValueError("Token has expired.")

    if expected_type and payload.get("type") != expected_type:
        raise ValueError("Invalid token type.")

    return payload


def get_access_token_lifetime():
    return timedelta(minutes=int(getattr(settings, "AUTH_ACCESS_TOKEN_LIFETIME_MINUTES", 60)))


def get_refresh_token_lifetime():
    return timedelta(days=int(getattr(settings, "AUTH_REFRESH_TOKEN_LIFETIME_DAYS", 7)))


def create_auth_tokens(user):
    return {
        "access": create_token(
            user=user,
            token_type="access",
            lifetime=get_access_token_lifetime(),
        ),
        "refresh": create_token(
            user=user,
            token_type="refresh",
            lifetime=get_refresh_token_lifetime(),
        ),
    }
