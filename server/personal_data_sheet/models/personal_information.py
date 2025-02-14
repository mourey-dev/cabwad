from django.db import models


class PersonalAddress(models.Model):
    house = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    subdivision = models.CharField(max_length=255)
    barangay = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    province = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=10)


class PersonalInformation(models.Model):
    SEX_DEFAULT = "M"
    SEX_CHOICES = (("M", "MALE"), ("F", "FEMALE"))

    CIVIL_STATUS_DEFAULT = "S"
    CIVIL_STATUS_CHOICES = (
        ("S", "SINGLE"),
        ("M", "MARRIED"),
        ("W", "WIDOWED"),
        ("SP", "SEPARATED"),
        ("O", "OTHER"),
    )

    CITIZENSHIP_DEFAULT = "F"
    CITIZENSHIP_CHOICES = (
        ("F", "FILIPINO"),
        ("DC", "DUAL CITIZEN"),
        ("B", "BY BIRTH"),
        ("N", "NATURALIZATION"),
        ("O", "OTHER"),
    )

    surname = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255)
    name_extension = models.CharField(max_length=25)
    birth_date = models.DateField()
    birth_place = models.CharField(max_length=255)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES, default=SEX_DEFAULT)
    civil_status = models.CharField(
        max_length=2, choices=CIVIL_STATUS_CHOICES, default=CIVIL_STATUS_DEFAULT
    )
    height = models.DecimalField(max_digits=10, decimal_places=2)
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    blood_type = models.CharField(max_length=10)
    gsis_no = models.CharField(max_length=50)
    pagibig_no = models.CharField(max_length=50)
    philhealth_no = models.CharField(max_length=50)
    sss_no = models.CharField(max_length=50)
    tin_no = models.CharField(max_length=50)
    agency_employee_no = models.CharField(max_length=50)
    citizenship = models.CharField(
        max_length=2, choices=CITIZENSHIP_CHOICES, default=CITIZENSHIP_DEFAULT
    )
    other_citizenship = models.CharField(max_length=255, blank=True, null=True)
    residential_address = models.ForeignKey(
        PersonalAddress,
        on_delete=models.CASCADE,
        related_name="residential_address_set",
    )
    permanent_address = models.ForeignKey(
        PersonalAddress, on_delete=models.CASCADE, related_name="permanent_address_set"
    )
    mobile_no = models.BigIntegerField()
    telephone_no = models.CharField(max_length=15)
    email = models.EmailField()
