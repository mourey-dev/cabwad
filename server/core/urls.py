from django.urls import path, include

urlpatterns = [
    path("employee/", include("employee.urls")),
    path("account/", include("account.urls")),
    path("pds/", include("pds.urls")),
    path("service-record/", include("service_record.urls")),
    path("backup/", include("backup.urls")),
]
