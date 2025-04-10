from django.db import models

from employee.models import Employee


class ServiceRecord(models.Model):
    # Change to ForeignKey since an employee can have multiple service records
    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="service_records"
    )

    service_from = models.CharField(max_length=50)
    service_to = models.CharField(max_length=50)
    designation = models.CharField(max_length=255)
    status = models.CharField(max_length=100)
    salary = models.CharField(max_length=100)
    station = models.CharField(max_length=255)
    absence = models.CharField(max_length=255)

    class Meta:
        ordering = ["-service_from"]

    def __str__(self):
        return f"{self.employee.full_name} - {self.designation} ({self.service_from})"
