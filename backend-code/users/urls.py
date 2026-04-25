from django.urls import path

from .views import login, me, refresh_token, signup

urlpatterns = [
    path("signup/", signup, name="signup"),
    path("login/", login, name="login"),
    path("refresh/", refresh_token, name="refresh-token"),
    path("me/", me, name="me"),
]
