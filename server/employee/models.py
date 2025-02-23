from django.db import models


class File(models.Model):
    name = models.CharField(max_length=255)
    file_id = models.CharField(max_length=255)

    class meta:
        db_name = "file"


class Employee(models.Model):
    first_name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    position = models.CharField(max_length=20)
    department = models.CharField(max_length=100)
    folder_id = models.CharField(max_length=255)
    files = models.ManyToManyField(File)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateField(auto_now_add=True)

    class meta:
        db_name = "employee"
