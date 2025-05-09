from rest_framework import serializers
from .models import Employee, File
from datetime import datetime
import re


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["name", "file_id", "uploaded", "file_type"]


class CustomDateField(serializers.DateField):
    """Custom DateField that handles multiple date formats"""

    def to_internal_value(self, value):
        if not value:
            return None

        if isinstance(value, str):
            # Try to parse MM/DD/YYYY format
            date_pattern = re.compile(r"(\d{1,2})/(\d{1,2})/(\d{4})")
            match = date_pattern.match(value)

            if match:
                try:
                    month, day, year = map(int, match.groups())
                    return datetime(year, month, day).date()
                except ValueError:
                    pass

        # Let the parent class handle standard formats
        return super().to_internal_value(value)


class EmployeeSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, required=False)
    middle_name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    civil_service = serializers.CharField(required=False, allow_blank=True)
    position = serializers.CharField(required=False, allow_blank=True)
    employee_id = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    # Replace standard DateField with our CustomDateField
    birth_date = CustomDateField(required=False, allow_null=True)
    folder_id = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Employee
        fields = [
            "employee_id",
            "first_name",
            "surname",
            "middle_name",
            "appointment_status",
            "position",
            "birth_date",
            "birth_place",
            "address",
            "first_day_service",
            "civil_service",
            "civil_status",
            "sex",
            "department",
            "folder_id",
            "files",
            "phone",
            "email",
            "is_active",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):
        """Set default birth_date if not provided"""
        if "birth_date" not in data or data["birth_date"] is None:
            data["birth_date"] = datetime.now().date()
        return data

    def validate_birth_date(self, value):
        """
        Validate birth_date is not in the future.
        Format conversion is now handled by CustomDateField.
        """
        if value is None:
            return datetime.now().date()

        if value > datetime.now().date():
            raise serializers.ValidationError("Birth date cannot be in the future")

        return value

    def validate_employee_id(self, value):
        """Validate employee_id is unique"""
        if self.instance is None:  # Creating new employee
            if Employee.objects.filter(employee_id=value).exists():
                raise serializers.ValidationError("This employee ID already exists")
        else:  # Updating existing employee
            if (
                Employee.objects.exclude(pk=self.instance.pk)
                .filter(employee_id=value)
                .exists()
            ):
                raise serializers.ValidationError("This employee ID already exists")
        return value

    def create(self, validated_data):
        files_data = validated_data.pop(
            "files", []
        )  # Default to empty list if no files
        employee = Employee.objects.create(**validated_data)
        for file_data in files_data:
            File.objects.create(**file_data)
        employee.files.set(
            File.objects.filter(file_id__in=[file["file_id"] for file in files_data])
        )
        return employee

    def update(self, instance, validated_data):
        # Use pop with a default empty list if files aren't provided
        files_data = validated_data.pop("files", [])

        # Update the instance with the remaining validated data
        instance = super().update(instance, validated_data)

        # Only modify files if files_data is provided
        if files_data:
            instance.files.clear()
            for file_data in files_data:
                File.objects.create(**file_data)
            instance.files.set(
                File.objects.filter(
                    file_id__in=[file["file_id"] for file in files_data]
                )
            )

        return instance
