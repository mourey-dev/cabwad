from rest_framework import serializers
from datetime import datetime
from .models import ServiceRecord, ServiceRecordManager


def format_date(date_value):
    """
    Format a date value to 'Month Day, Year' format (e.g., 'January 25, 2025')
    Handles None values, date objects, and string dates
    """
    if not date_value:
        return ""

    try:
        # If it's already a date object
        if hasattr(date_value, "strftime"):
            return date_value.strftime("%B %d, %Y")

        # If it's a string, try to parse it
        date_obj = datetime.strptime(str(date_value), "%Y-%m-%d")
        return date_obj.strftime("%B %d, %Y")
    except (ValueError, TypeError):
        # If parsing fails, return the original value
        return date_value


class ServiceRecordSerializer(serializers.ModelSerializer):
    # Override the date fields with SerializerMethodField to format them
    formatted_service_from = serializers.SerializerMethodField()
    formatted_service_to = serializers.SerializerMethodField()

    class Meta:
        model = ServiceRecord
        fields = [
            "id",
            "service_from",  # Keep original fields for data manipulation
            "service_to",
            "formatted_service_from",  # Add formatted fields for display
            "formatted_service_to",
            "designation",
            "status",
            "salary",
            "station",
            "absence",
        ]

    def get_formatted_service_from(self, obj):
        """Return the service_from date in 'January 25, 2025' format"""
        return format_date(obj.service_from)

    def get_formatted_service_to(self, obj):
        """Return the service_to date in 'January 25, 2025' format"""
        return format_date(obj.service_to)


class ServiceRecordManagerSerializer(serializers.ModelSerializer):
    """
    Serializer for the ServiceRecordManager model.
    """

    class Meta:
        model = ServiceRecordManager
        fields = ["id", "division_manager_c", "general_manager", "last_updated"]
        read_only_fields = ["id", "last_updated"]

    def create(self, validated_data):
        """
        Always update the singleton instance instead of creating a new one
        """
        instance = ServiceRecordManager.get_instance()
        return self.update(instance, validated_data)

    def update(self, instance, validated_data):
        """
        Update the manager fields
        """
        instance.division_manager = validated_data.get(
            "division_manager", instance.division_manager
        )
        instance.general_manager = validated_data.get(
            "general_manager", instance.general_manager
        )
        instance.save()
        return instance
