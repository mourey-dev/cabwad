from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.permissions import IsAuthenticated
from .serializers import LoginSerializer


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
