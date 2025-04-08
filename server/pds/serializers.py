from rest_framework import serializers
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


# Custom date field to format dates as mm/dd/yyyy
class FormattedDateField(serializers.DateField):
    def to_representation(self, value):
        if value:
            return value.strftime("%m/%d/%Y")
        return ""  # Return empty string instead of None


# Custom field for handling boolean-like values as strings
class StringBooleanField(serializers.CharField):
    def to_representation(self, value):
        if not value:  # Converts False, None, 0, "", etc. to empty string
            return ""
        return value  # Keep existing value


class PersonalInformationSerializer(serializers.ModelSerializer):
    # Override date fields with custom formatting
    p_birth_date = FormattedDateField()

    # Boolean fields converted to CharField
    p_sex_male = StringBooleanField()
    p_sex_female = StringBooleanField()
    p_civil_single = StringBooleanField()
    p_civil_widowed = StringBooleanField()
    p_civil_married = StringBooleanField()
    p_civil_separated = StringBooleanField()
    p_citizen_filipino = StringBooleanField()
    p_citizen_dual = StringBooleanField()
    p_citizen_by_birth = StringBooleanField()
    p_citizen_by_naturalization = StringBooleanField()

    class Meta:
        model = PersonalInformation
        exclude = ["id", "employee"]


class FamilyBackgroundSerializer(serializers.ModelSerializer):
    # Override all child birth date fields
    fb_children_birth_date_1 = FormattedDateField(required=False)
    fb_children_birth_date_2 = FormattedDateField(required=False)
    fb_children_birth_date_3 = FormattedDateField(required=False)
    fb_children_birth_date_4 = FormattedDateField(required=False)
    fb_children_birth_date_5 = FormattedDateField(required=False)
    fb_children_birth_date_6 = FormattedDateField(required=False)
    fb_children_birth_date_7 = FormattedDateField(required=False)
    fb_children_birth_date_8 = FormattedDateField(required=False)
    fb_children_birth_date_9 = FormattedDateField(required=False)
    fb_children_birth_date_10 = FormattedDateField(required=False)
    fb_children_birth_date_11 = FormattedDateField(required=False)
    fb_children_birth_date_12 = FormattedDateField(required=False)

    class Meta:
        model = FamilyBackground
        exclude = ["id", "employee"]


class EducationBackgroundSerializer(serializers.ModelSerializer):
    # Format education date fields
    eb_date = FormattedDateField()

    class Meta:
        model = EducationBackground
        exclude = ["id", "employee"]


class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        exclude = ["id", "employee"]


class VoluntaryWorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoluntaryWork
        exclude = ["id", "employee"]


class LearningDevelopmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningDevelopment
        exclude = ["id", "employee"]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "of_skill", "of_recognition", "of_membership"]
        exclude = ["id"]


class OtherInformationSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    # Format date fields
    w_date = FormattedDateField()
    of_date = FormattedDateField()

    # Boolean fields converted to CharField
    of_third_degree_yes = StringBooleanField()
    of_third_degree_no = StringBooleanField()
    of_fourth_degree_yes = StringBooleanField()
    of_fourth_degree_no = StringBooleanField()
    of_guilty_yes = StringBooleanField()
    of_guilty_no = StringBooleanField()
    of_criminal_yes = StringBooleanField()
    of_criminal_no = StringBooleanField()
    of_convicted_yes = StringBooleanField()
    of_convicted_no = StringBooleanField()
    of_resignation_yes = StringBooleanField()
    of_resignation_no = StringBooleanField()
    of_candidate_yes = StringBooleanField()
    of_candidate_no = StringBooleanField()
    of_government_yes = StringBooleanField()
    of_government_no = StringBooleanField()
    of_immigrant_yes = StringBooleanField()
    of_immigrant_no = StringBooleanField()
    of_indigenous_yes = StringBooleanField()
    of_indigenous_no = StringBooleanField()
    of_disability_yes = StringBooleanField()
    of_disability_no = StringBooleanField()
    of_solo_parent_yes = StringBooleanField()
    of_solo_parent_no = StringBooleanField()

    class Meta:
        model = OtherInformation
        exclude = ["id", "employee"]


class OtherInformationWithSkillsSerializer(OtherInformationSerializer):
    skills = SkillSerializer(many=True)

    class Meta(OtherInformationSerializer.Meta):
        exclude = ["id", "employee"]

    def create(self, validated_data):
        skills_data = validated_data.pop("skills")
        other_info = OtherInformation.objects.create(**validated_data)

        for skill_data in skills_data:
            Skill.objects.create(other_information=other_info, **skill_data)

        return other_info

    def update(self, instance, validated_data):
        skills_data = validated_data.pop("skills", None)

        # Update the OtherInformation instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if skills_data is not None:
            # Remove existing skills and create new ones
            instance.skills.all().delete()
            for skill_data in skills_data:
                Skill.objects.create(other_information=instance, **skill_data)

        return instance


# A comprehensive serializer to get all PDS data for an employee
class CompletePdsSerializer(serializers.Serializer):
    personal_information = PersonalInformationSerializer()
    family_background = FamilyBackgroundSerializer()
    education_backgrounds = EducationBackgroundSerializer(many=True)
    work_experiences = WorkExperienceSerializer(many=True)
    voluntary_works = VoluntaryWorkSerializer(many=True)
    learning_developments = LearningDevelopmentSerializer(many=True)
    other_information = OtherInformationWithSkillsSerializer()
