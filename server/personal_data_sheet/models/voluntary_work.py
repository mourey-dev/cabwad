from django.db import models


class VoluntaryWork(models.Model):
    organization = models.CharField(max_length=255)
    inclusive_from = models.DateField()
    inclusive_to = models.DateField()
    hours = models.IntegerField()
    position = models.CharField(max_length=255)
