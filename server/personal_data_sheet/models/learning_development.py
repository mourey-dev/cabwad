from django.db import models


class LearningDevelopment(models.Model):
    title = models.CharField(max_length=255)
    inclusive_from = models.DateField()
    inclusive_to = models.DateField()
    learning_type = models.CharField(max_length=255)
    conducted_by = models.CharField(max_length=255)
