from django.urls import path
from . import views

urlpatterns = [path("create-pds/", views.EmployeeView.as_view(), name="create_pds")]
