from django.urls import path
from . import views

urlpatterns = [
    path("", views.CompletePdsView.as_view(), name="pds"),
    path("<str:employee_id>/", views.CompletePdsView.as_view(), name="selected_pds"),
]
