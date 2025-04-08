from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

from .mixins import CompletePdsMixin

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
    OtherInformationWithSkillsSerializer,
    SkillSerializer,
)


class PersonalInformationViewSet(viewsets.ModelViewSet):
    queryset = PersonalInformation.objects.all()
    serializer_class = PersonalInformationSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        employee_id = request.data.get("employee")

        # Check if personal information already exists for this employee
        if PersonalInformation.objects.filter(employee_id=employee_id).exists():
            return Response(
                {"detail": "Personal information already exists for this employee"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().create(request, *args, **kwargs)


class FamilyBackgroundViewSet(viewsets.ModelViewSet):
    queryset = FamilyBackground.objects.all()
    serializer_class = FamilyBackgroundSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        employee_id = request.data.get("employee")

        # Check if family background already exists for this employee
        if FamilyBackground.objects.filter(employee_id=employee_id).exists():
            return Response(
                {"detail": "Family background already exists for this employee"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().create(request, *args, **kwargs)


class EducationBackgroundViewSet(viewsets.ModelViewSet):
    queryset = EducationBackground.objects.all()
    serializer_class = EducationBackgroundSerializer
    permission_classes = [IsAuthenticated]


class WorkExperienceViewSet(viewsets.ModelViewSet):
    queryset = WorkExperience.objects.all()
    serializer_class = WorkExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Add filtering by employee if needed
        employee_id = self.request.query_params.get("employee")
        if employee_id:
            return WorkExperience.objects.filter(employee_id=employee_id)
        return super().get_queryset()


class VoluntaryWorkViewSet(viewsets.ModelViewSet):
    queryset = VoluntaryWork.objects.all()
    serializer_class = VoluntaryWorkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Add filtering by employee if needed
        employee_id = self.request.query_params.get("employee")
        if employee_id:
            return VoluntaryWork.objects.filter(employee_id=employee_id)
        return super().get_queryset()


class LearningDevelopmentViewSet(viewsets.ModelViewSet):
    queryset = LearningDevelopment.objects.all()
    serializer_class = LearningDevelopmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Add filtering by employee if needed
        employee_id = self.request.query_params.get("employee")
        if employee_id:
            return LearningDevelopment.objects.filter(employee_id=employee_id)
        return super().get_queryset()


class OtherInformationViewSet(viewsets.ModelViewSet):
    queryset = OtherInformation.objects.all()
    serializer_class = OtherInformationSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return OtherInformationWithSkillsSerializer
        return self.serializer_class

    def create(self, request, *args, **kwargs):
        employee_id = request.data.get("employee")

        # Check if other information already exists for this employee
        if OtherInformation.objects.filter(employee_id=employee_id).exists():
            return Response(
                {"detail": "Other information already exists for this employee"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().create(request, *args, **kwargs)


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        other_info_id = self.request.query_params.get("other_information")
        if other_info_id:
            return Skill.objects.filter(other_information_id=other_info_id)
        return super().get_queryset()


class CompletePdsView(CompletePdsMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        """Get complete PDS data for an employee"""
        employee = self.get_employee(employee_id)
        data = self.get_complete_pds_data(employee)
        return Response(data)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        """Process all PDS data in a single transaction"""
        try:
            employee_id = request.data.get("employee_id")

            # Use the mixin to save all PDS data
            employee, results = self.save_pds_data(employee_id, request.data)

            return Response(
                {
                    "message": "PDS data saved successfully",
                    "employee_id": employee.employee_id,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
