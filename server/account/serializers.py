from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from rest_framework import serializers


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


class AccountSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    email = serializers.EmailField()
    birthdate = serializers.DateField()
    user_type = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(read_only=True)

    def get_user_type(self, obj):
        if obj.is_superuser:
            return "Super Admin"
        elif obj.is_admin:
            return "Admin"
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # No need to set user_type here as SerializerMethodField
        # will automatically call get_user_type
        return data

    def to_internal_value(self, data):
        # Handle incoming user_type during create/update
        internal_data = super().to_internal_value(data)
        user_type = data.get("user_type")
        if user_type:
            internal_data["is_admin"] = user_type == "Admin"
            internal_data["is_superuser"] = user_type == "Super Admin"
        return internal_data
