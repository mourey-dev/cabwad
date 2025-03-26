from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import LoginSerializer, AccountSerializer, ChangePasswordSerializer
from .models import User
from .permissions import IsAdminOrSuperAdmin
from .pagination import AccountPagination
from django.contrib.auth import update_session_auth_hash


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            return Response(
                {
                    "status": "success",
                    "message": "Login successful",
                    "data": response.data,
                },
                status=status.HTTP_200_OK,
            )
        return response


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response(
                    {"status": "error", "message": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            print("Attempting to blacklist token:", refresh_token)
            # Create token and add it to blacklist
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"status": "success", "message": "Logout successful"},
                status=status.HTTP_200_OK,
            )

        except TokenError as e:
            print("Token error:", str(e))
            return Response(
                {"status": "error", "message": f"Invalid token: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            print("Unexpected error:", str(e))
            return Response(
                {"status": "error", "message": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AccountView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrSuperAdmin]
    pagination_class = AccountPagination

    def get(self, request):
        try:
            # Get query parameters
            is_active = request.query_params.get("is_active")
            user_type = request.query_params.get("user_type")

            # Build filter conditions
            filters = {}
            if is_active is not None:
                filters["is_active"] = is_active.lower() == "true"
            if user_type:
                if user_type == "SUPER ADMIN":
                    filters["is_superuser"] = True
                elif user_type == "ADMIN":
                    filters["is_admin"] = True
                    filters["is_superuser"] = False

            # Get users with filters
            users = User.objects.filter(**filters)

            # Initialize paginator
            paginator = self.pagination_class()
            paginated_users = paginator.paginate_queryset(users, request)

            # Serialize the paginated data
            serializer = AccountSerializer(paginated_users, many=True)
            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            print("Error retrieving accounts:", str(e))
            return Response(
                {"status": "error", "message": "Failed to retrieve accounts"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        try:
            serializer = AccountSerializer(data=request.data)
            if serializer.is_valid():
                # Get user type from request data
                user_type = request.data.get("user_type")
                if not user_type:
                    return Response(
                        {"status": "error", "message": "User type is required"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Create user with validated data
                user = User.objects.create_user(
                    email=serializer.validated_data["email"],
                    birthdate=serializer.validated_data["birthdate"],
                    first_name=serializer.validated_data["first_name"],
                    last_name=serializer.validated_data["last_name"],
                    is_admin=user_type == "Admin",
                    is_superuser=user_type == "Super Admin",
                )

                # Serialize the created user for response
                response_serializer = AccountSerializer(user)
                return Response(
                    {
                        "status": "success",
                        "message": "Account created successfully",
                        "data": response_serializer.data,
                    },
                    status=status.HTTP_201_CREATED,
                )
            return Response(
                {
                    "status": "error",
                    "message": "Invalid data",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            print("Error creating account:", str(e))
            return Response(
                {"status": "error", "message": "Failed to create account"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request):
        """
        Toggle the is_active status of an account.
        """
        try:
            # Extract user_id from request data
            user_id = request.data.get("id")
            if not user_id:
                return Response(
                    {"status": "error", "message": "User ID is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Retrieve the user
            user = User.objects.get(id=user_id)

            # Toggle the is_active status
            user.is_active = not user.is_active
            user.save()

            # Prepare status message
            action = "activated" if user.is_active else "deactivated"

            return Response(
                {
                    "status": "success",
                    "message": f"Account {action} successfully",
                    "data": {
                        "id": user.id,
                        "email": user.email,
                        "is_active": user.is_active,
                    },
                },
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"status": "error", "message": "Account not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print(f"Error toggling account active status: {str(e)}")
            return Response(
                {"status": "error", "message": "Failed to toggle account status"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def put(self, request):
        try:
            user_id = request.data.get("id")
            user = User.objects.get(id=user_id)
            serializer = AccountSerializer(user, data=request.data, partial=True)

            if serializer.is_valid():
                # Update user fields
                for attr, value in serializer.validated_data.items():
                    setattr(user, attr, value)
                user.save()

                return Response(
                    {
                        "status": "success",
                        "message": "Account updated successfully",
                        "data": serializer.data,
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {
                    "status": "error",
                    "message": "Invalid data",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except User.DoesNotExist:
            return Response(
                {"status": "error", "message": "Account not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print("Error updating account:", str(e))
            return Response(
                {"status": "error", "message": "Failed to update account"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request):
        try:
            user_id = request.data.get("id")
            user = User.objects.get(id=user_id)

            # Toggle is_active instead of deleting
            user.is_active = False
            user.save()

            return Response(
                {
                    "status": "success",
                    "message": "Account deactivated successfully",
                    "data": {"id": user_id, "is_active": user.is_active},
                },
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"status": "error", "message": "Account not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print("Error deactivating account:", str(e))
            return Response(
                {"status": "error", "message": "Failed to deactivate account"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ChangePasswordView(APIView):
    """
    An endpoint for changing user password.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = ChangePasswordSerializer(data=request.data)

            if serializer.is_valid():
                user = request.user
                old_password = serializer.validated_data["old_password"]
                new_password = serializer.validated_data["new_password"]

                # Check if old password is correct
                if not user.check_password(old_password):
                    return Response(
                        {
                            "status": "error",
                            "detail": "Current password is incorrect.",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Check if new password is different from old password
                if old_password == new_password:
                    return Response(
                        {
                            "status": "error",
                            "detail": "New password cannot be the same as the current password.",
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Set the new password
                user.set_password(new_password)
                user.save()

                # Maintain user session if needed
                update_session_auth_hash(request, user)

                return Response(
                    {"status": "success", "detail": "Password updated successfully."},
                    status=status.HTTP_200_OK,
                )

            return Response(
                {
                    "status": "error",
                    "detail": "Invalid data",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            print(f"Error changing password: {str(e)}")
            return Response(
                {"status": "error", "detail": "Failed to change password"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AdminChangePasswordView(APIView):
    """
    An endpoint for administrators to reset user passwords.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Check if user has admin permissions
            if not request.user.is_admin and not request.user.is_superuser:
                return Response(
                    {
                        "status": "error",
                        "message": "You do not have permission to perform this action.",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Get user ID and new password
            user_id = request.data.get("user_id")
            new_password = request.data.get("new_password")

            if not user_id or not new_password:
                return Response(
                    {
                        "status": "error",
                        "message": "User ID and new password are required.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validate password length
            if len(new_password) < 8:
                return Response(
                    {
                        "status": "error",
                        "message": "Password must be at least 8 characters long.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the user
            from .models import User

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {"status": "error", "message": "User not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Set the new password
            user.set_password(new_password)
            user.save()

            return Response(
                {
                    "status": "success",
                    "message": f"Password for {user.email} has been reset successfully.",
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            print(f"Error resetting password: {str(e)}")
            return Response(
                {"status": "error", "message": "Failed to reset password"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
