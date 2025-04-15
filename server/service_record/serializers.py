from rest_framework import serializers
from datetime import datetime
from .models import ServiceRecord


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
