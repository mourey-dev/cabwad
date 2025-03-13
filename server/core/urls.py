from django.urls import path, include

urlpatterns = [
    path("employee/", include("employee.urls")),
    path("account/api/", include("account.urls")),
]
