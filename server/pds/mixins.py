from django.shortcuts import get_object_or_404
from django.db import transaction
from datetime import datetime

from employee.models import Employee
from .models import (
    PersonalInformation,
    FamilyBackground,
    EducationBackground,
    WorkExperience,
    VoluntaryWork,
    LearningDevelopment,
    OtherInformation,
    Skill,
)
from .serializers import (
    PersonalInformationSerializer,
    FamilyBackgroundSerializer,
    EducationBackgroundSerializer,
    WorkExperienceSerializer,
    VoluntaryWorkSerializer,
    LearningDevelopmentSerializer,
    OtherInformationSerializer,
)


class CompletePdsMixin:
    """Mixin to handle both retrieving and saving complete PDS data"""

    # GET-related methods
    def get_employee(self, employee_id):
        """Get employee by ID"""
        return get_object_or_404(Employee, employee_id=employee_id)

    def get_complete_pds_data(self, employee):
        """Get complete PDS data for an employee"""
        # Get all PDS data
        personal_info = getattr(employee, "personalinformation", None)
        family_bg = getattr(employee, "familybackground", None)
        education_bg = EducationBackground.objects.filter(employee=employee)
        work_exp = WorkExperience.objects.filter(employee=employee)
        voluntary_work = VoluntaryWork.objects.filter(employee=employee)
        learning_dev = LearningDevelopment.objects.filter(employee=employee)
        other_info = getattr(employee, "otherinformation", None)

        # Serialize data
        return {
            "personal_information": PersonalInformationSerializer(personal_info).data
            if personal_info
            else None,
            "family_background": FamilyBackgroundSerializer(family_bg).data
            if family_bg
            else None,
            "education_backgrounds": EducationBackgroundSerializer(
                education_bg, many=True
            ).data,
            "work_experiences": WorkExperienceSerializer(work_exp, many=True).data,
            "voluntary_works": VoluntaryWorkSerializer(voluntary_work, many=True).data,
            "learning_developments": LearningDevelopmentSerializer(
                learning_dev, many=True
            ).data,
            "other_information": OtherInformationSerializer(other_info).data
            if other_info
            else None,
        }

    # POST-related methods
    def process_personal_information(self, employee, data):
        """Process personal information data"""
        if not data:
            return None

        # Replace NULL and "False" values with empty strings for all fields
        for field_name, field_value in list(data.items()):
            # Skip date fields
            if field_name != "p_birth_date":
                if (
                    field_value is None
                    or field_value == "False"
                    or field_value is False
                ):
                    data[field_name] = (
                        ""  # Convert None, False or "False" to empty string
                    )

        # Handle date format conversion
        if "p_birth_date" in data:
            data["p_birth_date"] = self.convert_date_format(
                data["p_birth_date"], error_msg="Invalid birth date format"
            )

        if isinstance(employee, Employee):
            print("✅ 'employee' is an instance of Employee")

        # Create or update personal information
        personal_info, created = PersonalInformation.objects.update_or_create(
            employee=employee, defaults=data
        )

        return personal_info

    def process_family_background(self, employee, data):
        """Process family background data"""
        if not data:
            return None

        # Replace NULL with empty strings for all CharField fields
        for field_name, field_value in list(data.items()):
            # Skip date fields which can be NULL
            if field_value is None and not field_name.endswith("_birth_date"):
                data[field_name] = ""  # Convert NULL to empty string

        # Convert date strings if needed
        for i in range(1, 13):
            date_field = f"fb_children_birth_date_{i}"
            if date_field in data:
                data[date_field] = self.convert_date_format(data[date_field])

        # Create or update family background
        family_bg, created = FamilyBackground.objects.update_or_create(
            employee=employee, defaults=data
        )
        return family_bg

    def process_education_background(self, employee, data):
        """Process education background data"""
        if not data:
            return None

        # Create or update education background
        edu_bg, created = EducationBackground.objects.update_or_create(
            employee=employee, defaults={"eb_date": datetime.now().date(), **data}
        )
        return edu_bg

    def process_work_experience(self, employee, data_array):
        """Process work experience data"""
        if not data_array:
            return []

        # Delete existing entries
        WorkExperience.objects.filter(employee=employee).delete()

        created_items = []
        # Create new entries from non-empty items
        for work_exp in data_array:
            if any(work_exp.values()):  # Only create if at least one field has data
                # Convert salary to decimal if needed
                if "w_salary" in work_exp and work_exp["w_salary"] == "":
                    work_exp["w_salary"] = 0

                created_items.append(
                    WorkExperience.objects.create(employee=employee, **work_exp)
                )

        return created_items

    def process_voluntary_work(self, employee, data_array):
        """Process voluntary work data"""
        if not data_array:
            return []

        # Delete existing entries
        VoluntaryWork.objects.filter(employee=employee).delete()

        created_items = []
        # Create new entries from non-empty items
        for vol_work in data_array:
            if any(vol_work.values()):  # Only create if at least one field has data
                # Convert hours to integer if needed
                if "vw_hours" in vol_work:
                    try:
                        vol_work["vw_hours"] = (
                            int(vol_work["vw_hours"]) if vol_work["vw_hours"] else 0
                        )
                    except:
                        vol_work["vw_hours"] = 0

                created_items.append(
                    VoluntaryWork.objects.create(employee=employee, **vol_work)
                )

        return created_items

    def process_learning_development(self, employee, data_array):
        """Process learning development data"""
        if not data_array:
            return []

        # Delete existing entries
        LearningDevelopment.objects.filter(employee=employee).delete()

        created_items = []
        # Create new entries from non-empty items
        for learning_dev in data_array:
            if any(learning_dev.values()):  # Only create if at least one field has data
                created_items.append(
                    LearningDevelopment.objects.create(
                        employee=employee, **learning_dev
                    )
                )

        return created_items

    def process_other_information(self, employee, data):
        """Process other information data"""
        if not data:
            return None

        # Extract skills array
        skills_array = data.pop("skills", [])

        # Replace NULL and "False" values with empty strings for all fields
        for field_name, field_value in list(data.items()):
            # Skip date fields
            if field_name not in ["w_date", "of_date"]:
                if (
                    field_value is None
                    or field_value == "False"
                    or field_value is False
                ):
                    data[field_name] = (
                        ""  # Convert None, False or "False" to empty string
                    )

        # Handle date fields
        for date_field in ["w_date", "of_date"]:
            if date_field in data:
                data[date_field] = self.convert_date_format(
                    data[date_field], default=datetime.now().date()
                )
            else:
                data[date_field] = datetime.now().date()

        # Create or update other information
        other_info, created = OtherInformation.objects.update_or_create(
            employee=employee, defaults=data
        )

        # Process skills
        self.process_skills(other_info, skills_array)

        return other_info

    def process_skills(self, other_info, skills_array):
        """Process skills data"""
        if not skills_array:
            return []

        # Delete existing skills
        Skill.objects.filter(other_information=other_info).delete()

        created_items = []
        # Create new skills from non-empty items
        for skill in skills_array:
            if skill.get("of_skill"):  # Only create if skill name exists
                created_items.append(
                    Skill.objects.create(other_information=other_info, **skill)
                )

        return created_items

    def convert_date_format(self, date_str, error_msg=None, default=None):
        """Utility to convert date formats"""
        if not date_str or date_str == "":
            return default

        try:
            if "/" in date_str:
                month, day, year = date_str.split("/")
                return f"{year}-{month}-{day}"
            return date_str
        except Exception as e:
            if error_msg:
                raise ValueError(f"{error_msg}: {str(e)}")
            return default

    @transaction.atomic
    def save_pds_data(self, employee_id, data):
        """Save complete PDS data in a transaction"""
        try:
            employee = self.get_employee(employee_id)

            # Process each section
            results = {
                "personal_information": self.process_personal_information(
                    employee, data.get("personal_information", {})
                ),
                "family_background": self.process_family_background(
                    employee, data.get("family_background", {})
                ),
                "education_background": self.process_education_background(
                    employee, data.get("education_background", {})
                ),
                "work_experience": self.process_work_experience(
                    employee, data.get("work_experience", [])
                ),
                "voluntary_work": self.process_voluntary_work(
                    employee, data.get("voluntary_work", [])
                ),
                "learning_development": self.process_learning_development(
                    employee, data.get("learning_development", [])
                ),
                "other_information": self.process_other_information(
                    employee, data.get("other_information", {})
                ),
            }

            return employee, results

        except Exception as e:
            raise e

    def delete_pds_data(self, employee):
        """Delete all PDS data for the given employee"""
        deleted_items = {
            "personal_information": False,
            "family_background": False,
            "education_backgrounds": 0,
            "work_experiences": 0,
            "voluntary_works": 0,
            "learning_developments": 0,
            "other_information": False,
            "skills": 0,
        }

        try:
            # Delete OneToOne relationships
            try:
                if hasattr(employee, "personalinformation"):
                    employee.personalinformation.delete()
                    deleted_items["personal_information"] = True
            except Exception as e:
                print(f"Error deleting personal information: {str(e)}")

            try:
                if hasattr(employee, "familybackground"):
                    employee.familybackground.delete()
                    deleted_items["family_background"] = True
            except Exception as e:
                print(f"Error deleting family background: {str(e)}")

            try:
                if hasattr(employee, "otherinformation"):
                    # Count skills before deletion
                    skill_count = Skill.objects.filter(
                        other_information=employee.otherinformation
                    ).count()
                    deleted_items["skills"] = skill_count

                    # Delete other information (skills will cascade)
                    employee.otherinformation.delete()
                    deleted_items["other_information"] = True
            except Exception as e:
                print(f"Error deleting other information: {str(e)}")

            # Delete ForeignKey relationships
            deleted_items["education_backgrounds"] = EducationBackground.objects.filter(
                employee=employee
            ).count()
            EducationBackground.objects.filter(employee=employee).delete()

            deleted_items["work_experiences"] = WorkExperience.objects.filter(
                employee=employee
            ).count()
            WorkExperience.objects.filter(employee=employee).delete()

            deleted_items["voluntary_works"] = VoluntaryWork.objects.filter(
                employee=employee
            ).count()
            VoluntaryWork.objects.filter(employee=employee).delete()

            deleted_items["learning_developments"] = LearningDevelopment.objects.filter(
                employee=employee
            ).count()
            LearningDevelopment.objects.filter(employee=employee).delete()

            return True, deleted_items

        except Exception as e:
            print(f"Error in delete_pds_data: {str(e)}")
            return False, {"error": str(e), "deleted_items": deleted_items}
