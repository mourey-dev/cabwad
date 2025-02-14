from django.db import models


class Children(models.Model):
    name = models.CharField(max_length=255)
    birth_date = models.DateField()


class FamilyBackground(models.Model):
    spouse_surname = models.CharField(max_length=255)
    spouse_first_name = models.CharField(max_length=255)
    spouse_middle_name = models.CharField(max_length=255)
    spouse_name_extension = models.CharField(max_length=50)
    spouse_occupation = models.CharField(max_length=50)
    spouse_employer = models.CharField(max_length=50)
    spouse_business_address = models.CharField(max_length=255)
    spouse_telephone = models.CharField(max_length=15)
    father_surname = models.CharField(max_length=255)
    father_first_name = models.CharField(max_length=255)
    father_middle_name = models.CharField(max_length=255)
    children = models.ManyToManyField(Children)
