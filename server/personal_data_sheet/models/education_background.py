from django.db import models


class School(models.Model):
    name = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    attendance_from = models.DateField()
    attendance_to = models.DateField()
    units_earned = models.CharField(max_length=255)
    year_graduated = models.IntegerField()
    honors_received = models.CharField(max_length=255)


class EducationBackground(models.Model):
    elementary = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="elementary"
    )
    secondary = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="secondary"
    )
    vocational = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="vocational"
    )
    college = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="college"
    )
    graduate_studies = models.ForeignKey(
        School, on_delete=models.CASCADE, related_name="graduate_studies"
    )
    date = models.DateField()
