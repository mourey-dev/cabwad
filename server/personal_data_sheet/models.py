from django.db import models

from .models.personal_information import PersonalInformation
from .models.civil_service_eligibility import CivilServiceEligibility
from .models.education_background import EducationBackground
from .models.family_background import FamilyBackground
from .models.learning_development import LearningDevelopment
from .models.other_information import OtherInformation
from .models.voluntary_work import VoluntaryWork
from .models.work_experience import WorkExperience


class PersonalDataSheet(models.Model):
    personal_information = models.ForeignKey(
        PersonalInformation, on_delete=models.CASCADE
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
