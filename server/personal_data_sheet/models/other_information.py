from django.db import models


class Information(models.Model):
    special_skill = models.CharField(max_length=255)
    recognition = models.CharField(max_length=255)
    organization_membership = models.CharField(max_length=255)


class Reference(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    telephone = models.CharField(max_length=15)


class OtherInformation(models.Model):
    information = models.ManyToManyField(Information)
    third_degree = models.BooleanField(default=False)
    fourth_degree = models.BooleanField(default=False)
    administrative_guilty = models.BooleanField(default=False)
    criminally_charged = models.BooleanField(default=False)
    crime_convicted = models.BooleanField(default=False)
    service_separated = models.BooleanField(default=False)
    national_candidate = models.BooleanField(default=False)
    government_resigned = models.BooleanField(default=False)
    immigrant = models.BooleanField(default=False)
    indigenous = models.BooleanField(default=False)
    person_with_disability = models.BooleanField(default=False)
    solo_parent = models.BooleanField(default=False)
    references = models.ManyToManyField(Reference)
    government_id = models.CharField(max_length=255)
    id_no = models.CharField(max_length=255)
    date_place_issuance = models.CharField(max_length=255)
    sworn = models.CharField(max_length=255)
    within_degree = models.CharField(max_length=255)
    date_filled = models.DateField()
    case_status = models.CharField(max_length=255)
    convicted_details = models.CharField(max_length=255)
    service_separated_details = models.CharField(max_length=255)
    immigrant_details = models.CharField(max_length=255)
    indigenous = models.CharField(max_length=255)
    disability_details = models.CharField(max_length=255)
    solo_parent_details = models.CharField(max_length=255)
