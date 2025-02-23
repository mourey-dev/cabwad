from rest_framework import serializers
from .models import File, Employee


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["id", "name", "file_id"]


class EmployeeSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True)

    class Meta:
        model = Employee
        fields = [
            "id",
            "first_name",
            "surname",
            "position",
            "department",
            "folder_id",
            "files",
            "is_active",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        files_data = validated_data.pop("files")
        employee = Employee.objects.create(**validated_data)
        for file_data in files_data:
            File.objects.create(**file_data, employee=employee)
        return employee
