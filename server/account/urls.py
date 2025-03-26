from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView,
    TokenVerifyView,
)

from .views import (
    LoginView,
    LogoutView,
    AccountView,
    ChangePasswordView,
    AdminChangePasswordView,
)

urlpatterns = [
    path("list/", AccountView.as_view(), name="accounts"),
    # Authentication endpoints
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    # JWT token endpoints
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/blacklist/", TokenBlacklistView.as_view(), name="token_blacklist"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path(
        "admin/reset-password/",
        AdminChangePasswordView.as_view(),
        name="admin-reset-password",
    ),
]
