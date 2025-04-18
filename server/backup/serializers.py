from rest_framework import serializers
from .models import BackupRecord


class BackupRecordSerializer(serializers.ModelSerializer):
    """
    Serializer for the BackupRecord model
    """

    formatted_size = serializers.ReadOnlyField()
    days_until_deletion = serializers.ReadOnlyField()
    is_local_available = serializers.ReadOnlyField()
    is_google_drive_available = serializers.ReadOnlyField()

    class Meta:
        model = BackupRecord
        fields = [
            "id",
            "filename",
            "created_at",
            "size_bytes",
            "formatted_size",
            "is_compressed",
            "status",
            "storage_location",
            "local_path",
            "google_drive_id",
            "execution_time_seconds",
            "error_message",
            "database_name",
            "user_who_ran",
            "retention_days",
            "scheduled_deletion",
            "days_until_deletion",
            "is_local_available",
            "is_google_drive_available",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "execution_time_seconds",
            "formatted_size",
            "days_until_deletion",
            "is_local_available",
            "is_google_drive_available",
        ]
