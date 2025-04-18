from django.urls import path
from .views import (
    BackupListView,
    BackupDetailView,
    BackupDownloadView,
    BackupExecuteView,
)

urlpatterns = [
    path("", BackupListView.as_view(), name="backup-list"),
    path("<int:pk>/", BackupDetailView.as_view(), name="backup-detail"),
    path("<int:pk>/download/", BackupDownloadView.as_view(), name="backup-download"),
    path("execute/", BackupExecuteView.as_view(), name="backup-execute"),
]
