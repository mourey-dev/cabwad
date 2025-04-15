from django.db import models

from employee.models import Employee


class ServiceRecord(models.Model):
    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="service_records"
    )

    service_from = models.CharField(max_length=50, blank=True, null=True)
    service_to = models.CharField(max_length=50, blank=True, null=True)
    designation = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=100, blank=True, null=True)
    salary = models.CharField(max_length=100, blank=True, null=True)
    station = models.CharField(max_length=255, blank=True, null=True)
    absence = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ["-service_from"]

    def __str__(self):
        return f"{self.employee.full_name} - {self.designation} ({self.service_from})"
