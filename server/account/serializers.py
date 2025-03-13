from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate


class LoginSerializer(TokenObtainPairSerializer):
    username_field = "username"

    def validate(self, attrs):
        credentials = {
            "username": attrs.get("username"),
            "password": attrs.get("password"),
        }

        if not credentials["username"] or not credentials["password"]:
            raise AuthenticationFailed("Username and password are required")

        user = authenticate(**credentials)

        if not user:
            raise AuthenticationFailed("Invalid username or password")

        if not user.is_active:
            raise AuthenticationFailed("User account is disabled")

        data = super().validate(attrs)

        # Add extra responses
        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }

        return data
