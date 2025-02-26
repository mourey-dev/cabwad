from django.db import models
from enum import Enum


class FileType(Enum):
    csc = "Certificate of CSC Eligibility"
    dca = "Diplomas, Commendations and Awards"
    mco = "Marriage Contract"
    mce = "Marriage Certificate"
    nbi = "NBI Clearance"
    pds = "Personal Data Sheet"
    bc = "Birth Certificate"
    rb = "Resume, Biodata"
    bcc = "Birth Certificate of Child/ren"
    tor = "Transcript of Records"
    form137 = "Form 137"
    form138 = "Form 138-A"
    dl = "Driver's License (Photocopy)"
    prc = "PRC License (Photocopy)"
    tc = "Training Certificate"
    a = "Appointments"
    aod = "Assumption of Duty"
    colb = "Certificate of Leave Balances"
    cos = "Contract of Services"
    cda = "Copies of Disciplinary Actions"
    nosa = "Notice of Salary Adjustment/Step Increment"
    oo = "Oath of Office"
    pdf = "Position Description Forms"
    sss = "SSS"
    pi = "Pag-Ibig"
    p = "Philhealth"
    tin = "TIN No."

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class File(models.Model):
    name = models.CharField(max_length=255)
    file_id = models.CharField(max_length=255)
    uploaded = models.BooleanField(default=False)
    file_type = models.CharField(
        max_length=255, choices=FileType.choices(), default=None
    )

    class Meta:
        db_table = "file"


class Employee(models.Model):
    first_name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    position = models.CharField(max_length=20)
    department = models.CharField(max_length=100)
    folder_id = models.CharField(max_length=255)
    files = models.ManyToManyField(File)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "employee"
