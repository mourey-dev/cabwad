from django.db import models
from employee.models import Employee


class PersonalInformation(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE)

    # Personal details
    p_surname = models.CharField(max_length=100)
    p_first_name = models.CharField(max_length=100)
    p_middle_name = models.CharField(max_length=100, blank=True)
    p_name_extension = models.CharField(max_length=20, blank=True)
    p_birth_date = models.DateField()
    p_birth_place = models.CharField(max_length=255)

    # Sex - changed from BooleanField to CharField
    p_sex_male = models.CharField(max_length=50, blank=True, default="")
    p_sex_female = models.CharField(max_length=50, blank=True, default="")

    # Civil status - changed from BooleanField to CharField
    p_civil_single = models.CharField(max_length=50, blank=True, default="")
    p_civil_widowed = models.CharField(max_length=50, blank=True, default="")
    p_civil_married = models.CharField(max_length=50, blank=True, default="")
    p_civil_separated = models.CharField(max_length=50, blank=True, default="")
    p_civil_other = models.CharField(max_length=100, blank=True)

    # Physical attributes
    p_weight = models.CharField(max_length=20)
    p_height = models.CharField(max_length=20)
    p_blood_type = models.CharField(max_length=10)

    # Government IDs
    p_gsis_no = models.CharField(max_length=50, blank=True)
    p_pagibig_no = models.CharField(max_length=50, blank=True)
    p_philhealth_no = models.CharField(max_length=50, blank=True)
    p_sss_no = models.CharField(max_length=50, blank=True)
    p_tin_no = models.CharField(max_length=50, blank=True)
    p_agency_no = models.CharField(max_length=50, blank=True)

    # Citizenship information - changed from BooleanField to CharField
    p_citizen_filipino = models.CharField(max_length=50, blank=True, default="")
    p_citizen_dual = models.CharField(max_length=50, blank=True, default="")
    p_citizen_by_birth = models.CharField(max_length=50, blank=True, default="")
    p_citizen_by_naturalization = models.CharField(
        max_length=50, blank=True, default=""
    )

    # Residential address
    p_ra_house = models.CharField(max_length=100, blank=True)
    p_ra_street = models.CharField(max_length=100, blank=True)
    p_ra_subdivision = models.CharField(max_length=100, blank=True)
    p_ra_barangay = models.CharField(max_length=100)
    p_ra_city = models.CharField(max_length=100)
    p_ra_province = models.CharField(max_length=100)
    p_ra_zip = models.CharField(max_length=20)

    # Permanent address
    p_pa_house = models.CharField(max_length=100, blank=True)
    p_pa_street = models.CharField(max_length=100, blank=True)
    p_pa_subdivision = models.CharField(max_length=100, blank=True)
    p_pa_barangay = models.CharField(max_length=100)
    p_pa_city = models.CharField(max_length=100)
    p_pa_province = models.CharField(max_length=100)
    p_pa_zip = models.CharField(max_length=20)

    # Contact information
    p_telephone = models.CharField(max_length=50, blank=True)
    p_mobile = models.CharField(max_length=50, blank=True)
    p_email = models.EmailField(blank=True)

    def __str__(self):
        return f"{self.p_first_name} {self.p_surname}"

    class Meta:
        verbose_name = "Personal Information"
        verbose_name_plural = "Personal Information"


class FamilyBackground(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE)

    # Spouse information
    fb_spouse_surname = models.CharField(max_length=100, blank=True)
    fb_spouse_first_name = models.CharField(max_length=100, blank=True)
    fb_spouse_middle_name = models.CharField(max_length=100, blank=True)
    fb_spouse_name_extension = models.CharField(max_length=20, blank=True)
    fb_spouse_occupation = models.CharField(max_length=100, blank=True)
    fb_spouse_employer = models.CharField(max_length=200, blank=True)
    fb_spouse_business = models.CharField(max_length=200, blank=True)
    fb_spouse_telephone = models.CharField(max_length=50, blank=True)

    # Father's information
    fb_father_surname = models.CharField(max_length=100)
    fb_father_first_name = models.CharField(max_length=100)
    fb_father_middle_name = models.CharField(max_length=100, blank=True)
    fb_father_name_extension = models.CharField(max_length=20, blank=True)

    # Mother's information
    fb_mother_maiden_name = models.CharField(max_length=100)
    fb_mother_surname = models.CharField(max_length=100)
    fb_mother_first_name = models.CharField(max_length=100)
    fb_mother_middle_name = models.CharField(max_length=100, blank=True)

    # Children information
    fb_children_name_1 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_1 = models.DateField(null=True, blank=True)
    fb_children_name_2 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_2 = models.DateField(null=True, blank=True)
    fb_children_name_3 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_3 = models.DateField(null=True, blank=True)
    fb_children_name_4 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_4 = models.DateField(null=True, blank=True)
    fb_children_name_5 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_5 = models.DateField(null=True, blank=True)
    fb_children_name_6 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_6 = models.DateField(null=True, blank=True)
    fb_children_name_7 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_7 = models.DateField(null=True, blank=True)
    fb_children_name_8 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_8 = models.DateField(null=True, blank=True)
    fb_children_name_9 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_9 = models.DateField(null=True, blank=True)
    fb_children_name_10 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_10 = models.DateField(null=True, blank=True)
    fb_children_name_11 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_11 = models.DateField(null=True, blank=True)
    fb_children_name_12 = models.CharField(max_length=200, blank=True)
    fb_children_birth_date_12 = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Family Background of {self.employee}"

    class Meta:
        verbose_name = "Family Background"
        verbose_name_plural = "Family Backgrounds"


class EducationBackground(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)

    # Elementary education
    eb_e_school_name = models.CharField(max_length=200, blank=True)
    eb_e_basic_education = models.CharField(max_length=200, blank=True)
    eb_e_period_from = models.CharField(max_length=50, blank=True)
    eb_e_period_to = models.CharField(max_length=50, blank=True)
    eb_e_units_earned = models.CharField(max_length=50, blank=True)
    eb_e_year_graduated = models.CharField(max_length=50, blank=True)
    eb_e_honor_received = models.CharField(max_length=200, blank=True)

    # Secondary education
    eb_s_school_name = models.CharField(max_length=200, blank=True)
    eb_s_basic_education = models.CharField(max_length=200, blank=True)
    eb_s_period_from = models.CharField(max_length=50, blank=True)
    eb_s_period_to = models.CharField(max_length=50, blank=True)
    eb_s_units_earned = models.CharField(max_length=50, blank=True)
    eb_s_year_graduated = models.CharField(max_length=50, blank=True)
    eb_s_honor_received = models.CharField(max_length=200, blank=True)

    # Vocational education
    eb_v_school_name = models.CharField(max_length=200, blank=True)
    eb_v_basic_education = models.CharField(max_length=200, blank=True)
    eb_v_period_from = models.CharField(max_length=50, blank=True)
    eb_v_period_to = models.CharField(max_length=50, blank=True)
    eb_v_units_earned = models.CharField(max_length=50, blank=True)
    eb_v_year_graduated = models.CharField(max_length=50, blank=True)
    eb_v_honor_received = models.CharField(max_length=200, blank=True)

    # College education
    eb_c_school_name = models.CharField(max_length=200, blank=True)
    eb_c_basic_education = models.CharField(max_length=200, blank=True)
    eb_c_period_from = models.CharField(max_length=50, blank=True)
    eb_c_period_to = models.CharField(max_length=50, blank=True)
    eb_c_units_earned = models.CharField(max_length=50, blank=True)
    eb_c_year_graduated = models.CharField(max_length=50, blank=True)
    eb_c_honor_received = models.CharField(max_length=200, blank=True)

    # Graduate studies
    eb_gs_school_name = models.CharField(max_length=200, blank=True)
    eb_gs_basic_education = models.CharField(max_length=200, blank=True)
    eb_gs_period_from = models.CharField(max_length=50, blank=True)
    eb_gs_period_to = models.CharField(max_length=50, blank=True)
    eb_gs_units_earned = models.CharField(max_length=50, blank=True)
    eb_gs_year_graduated = models.CharField(max_length=50, blank=True)
    eb_gs_honor_received = models.CharField(max_length=200, blank=True)

    # Form date
    eb_date = models.DateField()

    def __str__(self):
        return f"Education Background of {self.employee}"

    class Meta:
        verbose_name = "Education Background"
        verbose_name_plural = "Education Backgrounds"


class WorkExperience(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)

    w_from = models.CharField(max_length=50)
    w_to = models.CharField(
        max_length=50
    )  # Using CharField to allow "Present" as a value
    w_position = models.CharField(max_length=200)
    w_department = models.CharField(max_length=200)
    w_salary = models.DecimalField(max_digits=12, decimal_places=2)
    w_pay_grade = models.CharField(max_length=50)
    w_soa = models.CharField(max_length=100)  # Status of appointment
    w_gov_service = models.CharField(max_length=10)  # Yes/No or similar

    def __str__(self):
        return f"{self.w_position} at {self.w_department} ({self.w_from} - {self.w_to})"

    class Meta:
        verbose_name = "Work Experience"
        verbose_name_plural = "Work Experiences"
        ordering = ["-w_from"]  # Most recent first


class VoluntaryWork(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)

    vw_organization = models.CharField(max_length=200)
    vw_from = models.CharField(max_length=50)
    vw_to = models.CharField(max_length=50)
    vw_hours = models.PositiveIntegerField()
    vw_position = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.vw_position} at {self.vw_organization}"

    class Meta:
        verbose_name = "Voluntary Work"
        verbose_name_plural = "Voluntary Works"
        ordering = ["-vw_from"]  # Most recent first


class LearningDevelopment(models.Model):
    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="learning_developments"
    )

    ld_learning = models.CharField(max_length=255)
    ld_from = models.CharField(max_length=50)
    ld_to = models.CharField(max_length=50)
    ld_hours = models.CharField(
        max_length=50
    )  # Keeping as CharField as per TS definition
    ld_type = models.CharField(max_length=100)
    ld_conducted = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.ld_learning} ({self.ld_from} - {self.ld_to})"

    class Meta:
        verbose_name = "Learning and Development"
        verbose_name_plural = "Learning and Development"
        ordering = ["-ld_from"]  # Most recent first


class OtherInformation(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE)

    # Date fields
    w_date = models.DateField()
    of_date = models.DateField()

    # Third degree relation - changed from BooleanField to CharField
    of_third_degree_yes = models.CharField(max_length=50, blank=True, default="")
    of_third_degree_no = models.CharField(max_length=50, blank=True, default="")

    # Fourth degree relation - changed from BooleanField to CharField
    of_fourth_degree_yes = models.CharField(max_length=50, blank=True, default="")
    of_fourth_degree_no = models.CharField(max_length=50, blank=True, default="")
    of_affinity_details = models.TextField(blank=True)

    # Legal questions - guilty - changed from BooleanField to CharField
    of_guilty_yes = models.CharField(max_length=50, blank=True, default="")
    of_guilty_no = models.CharField(max_length=50, blank=True, default="")
    of_guilty_details = models.TextField(blank=True)

    # Criminal case - changed from BooleanField to CharField
    of_criminal_yes = models.CharField(max_length=50, blank=True, default="")
    of_criminal_no = models.CharField(max_length=50, blank=True, default="")
    of_criminal_date_filled = models.CharField(max_length=100, blank=True)
    of_criminal_status = models.CharField(max_length=100, blank=True)

    # Convicted - changed from BooleanField to CharField
    of_convicted_yes = models.CharField(max_length=50, blank=True, default="")
    of_convicted_no = models.CharField(max_length=50, blank=True, default="")
    of_convicted_details = models.TextField(blank=True)

    # Resignation - changed from BooleanField to CharField
    of_resignation_yes = models.CharField(max_length=50, blank=True, default="")
    of_resignation_no = models.CharField(max_length=50, blank=True, default="")
    of_resignation_details = models.TextField(blank=True)

    # Candidate - changed from BooleanField to CharField
    of_candidate_yes = models.CharField(max_length=50, blank=True, default="")
    of_candidate_no = models.CharField(max_length=50, blank=True, default="")
    of_candidate_details = models.TextField(blank=True)

    # Government service - changed from BooleanField to CharField
    of_government_yes = models.CharField(max_length=50, blank=True, default="")
    of_government_no = models.CharField(max_length=50, blank=True, default="")
    of_government_details = models.TextField(blank=True)

    # Immigrant - changed from BooleanField to CharField
    of_immigrant_yes = models.CharField(max_length=50, blank=True, default="")
    of_immigrant_no = models.CharField(max_length=50, blank=True, default="")
    of_immigrant_details = models.TextField(blank=True)

    # Indigenous - changed from BooleanField to CharField
    of_indigenous_yes = models.CharField(max_length=50, blank=True, default="")
    of_indigenous_no = models.CharField(max_length=50, blank=True, default="")
    of_indigenous_details = models.TextField(blank=True)

    # Disability - changed from BooleanField to CharField
    of_disability_yes = models.CharField(max_length=50, blank=True, default="")
    of_disability_no = models.CharField(max_length=50, blank=True, default="")
    of_disability_details = models.TextField(blank=True)

    # Solo parent - changed from BooleanField to CharField
    of_solo_parent_yes = models.CharField(max_length=50, blank=True, default="")
    of_solo_parent_no = models.CharField(max_length=50, blank=True, default="")
    of_solo_parent_details = models.TextField(blank=True)

    # References
    of_reference_name_1 = models.CharField(max_length=200, blank=True)
    of_reference_address_1 = models.TextField(blank=True)
    of_reference_telephone_1 = models.CharField(max_length=50, blank=True)

    of_reference_name_2 = models.CharField(max_length=200, blank=True)
    of_reference_address_2 = models.TextField(blank=True)
    of_reference_telephone_2 = models.CharField(max_length=50, blank=True)

    of_reference_name_3 = models.CharField(max_length=200, blank=True)
    of_reference_address_3 = models.TextField(blank=True)
    of_reference_telephone_3 = models.CharField(max_length=50, blank=True)

    # Government ID
    of_government_id = models.CharField(max_length=100, blank=True)
    of_id_no = models.CharField(max_length=100, blank=True)
    of_issuance = models.CharField(max_length=100, blank=True)

    # Profile picture
    of_profile_filename = models.CharField(max_length=255, blank=True)
    of_profile_filetype = models.CharField(max_length=50, blank=True)
    of_profile_file = models.FileField(
        upload_to="profile_photos/", blank=True, null=True
    )

    def __str__(self):
        return f"Other Information of {self.employee}"

    class Meta:
        verbose_name = "Other Information"
        verbose_name_plural = "Other Information"


class Skill(models.Model):
    other_information = models.ForeignKey(
        OtherInformation, on_delete=models.CASCADE, related_name="skills"
    )

    of_skill = models.CharField(max_length=200)
    of_recognition = models.CharField(max_length=200, blank=True)
    of_membership = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.of_skill

    class Meta:
        verbose_name = "Skill"
        verbose_name_plural = "Skills"
