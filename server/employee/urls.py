from django.urls import path
from . import views

urlpatterns = [
    path("pds/", views.PDSView.as_view(), name="pds"),
    path("pds/<str:employee_id>/", views.PDSView.as_view(), name="selected_pds"),
    path("list/", views.EmployeeView.as_view(), name="employee_list"),
    path("list/<str:employee_id>/", views.EmployeeView.as_view(), name="employee"),
    path("count/", views.EmployeeCount.as_view(), name="employee_count"),
    path("files/", views.EmployeeFile.as_view(), name="employee_file"),
]
