from django.urls import path
from . import views

urlpatterns = [
    # Endpoints for employee service records
    path("", views.ServiceRecordView.as_view(), name="service_record_list"),
    path(
        "<str:employee_id>/",
        views.ServiceRecordView.as_view(),
        name="employee_service_records",
    ),
]
