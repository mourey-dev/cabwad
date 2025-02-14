from django.db import models


class Service(models.Model):
    career_service = models.CharField(max_length=255)
    rating = models.CharField(max_length=255)
    examination_date = models.DateField()
    examination_place = models.CharField(max_length=255)
    license_number = models.CharField(max_length=50)
    license_validity = models.DateField()


class CivilServiceEligibility(models.Model):
    services = models.ManyToManyField(Service)
