from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView,
    TokenVerifyView,
)

from .views import LoginView

urlpatterns = [
    path("api/token/", LoginView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/black/", TokenBlacklistView.as_view(), name="token_black"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify_view"),
]
