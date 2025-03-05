from rest_framework import serializers
from .models import Employee, File


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["name", "file_id", "uploaded", "file_type"]


class EmployeeSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True)
    middle_name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    civil_service = serializers.CharField(required=False, allow_blank=True)

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

    def create(self, validated_data):
        files_data = validated_data.pop("files")
        employee = Employee.objects.create(**validated_data)
        for file_data in files_data:
            File.objects.create(**file_data)
        employee.files.set(
            File.objects.filter(file_id__in=[file["file_id"] for file in files_data])
        )
        return employee

    def update(self, instance, validated_data):
        files_data = validated_data.pop("files")
        instance = super().update(instance, validated_data)
        instance.files.clear()
        for file_data in files_data:
            File.objects.create(**file_data)
        instance.files.set(
            File.objects.filter(file_id__in=[file["file_id"] for file in files_data])
        )
        return instance
