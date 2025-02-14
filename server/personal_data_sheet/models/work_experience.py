from django.db import models


class WorkExperience(models.Model):
    inclusive_from = models.DateField()
    inclusive_to = models.DateField()
    position_title = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    monthly_salary = models.DecimalField(decimal_places=2)
    salary = models.CharField(max_length=255)
    appointment_status = models.CharField(max_length=255)
    gov_service = models.CharField(max_length=255)
