from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication

from .utilities.update_dict_key import update_dict_key
from .utilities.create_pds import create_pds
from .utilities.destructure_dict import destructure_dict

from .models import Employee
from .serializers import EmployeeSerializer

from services.drive_services import get_file_to_folder


class PDSView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        data = request.data
        update_dict_key(data["learning_development"])
        update_dict_key(data["civil_service_eligibility"])
        update_dict_key(data["work_experience"])
        update_dict_key(data["voluntary_work"])
        update_dict_key(data["other_information"]["skills"])

        data["civil_service_eligibility"] = destructure_dict(
            data["civil_service_eligibility"]
        )
        data["work_experience"] = destructure_dict(data["work_experience"])
        data["voluntary_work"] = destructure_dict(data["voluntary_work"])
        data["learning_development"] = destructure_dict(data["learning_development"])
        data["other_information"].update(
            destructure_dict(data["other_information"]["skills"])
        )

        # Remove the skills key from other_information
        data["other_information"].pop("skills")

        combined_data = {}
        combined_data.update(data["personal_information"])
        combined_data.update(data["family_background"])
        combined_data.update(data["educational_background"])
        combined_data.update(data["civil_service_eligibility"])
        combined_data.update(data["work_experience"])
        combined_data.update(data["voluntary_work"])
        combined_data.update(data["learning_development"])
        combined_data.update(data["other_information"])

        pds = create_pds(combined_data)
        file = pds.get("file")

        employee = {
            "first_name": combined_data["p_first_name"],
            "surname": combined_data["p_surname"],
            "position": data["position"],
            "department": data["department"],
            "folder_id": pds["folder_id"],
            # "elementary": combined_data[""],
            # "secondary": combined_data[""],
            # "college": combined_data[""],
            # "phone": combined_data[""],
            # "email": combined_data[""],
            "files": [
                {
                    "name": file["name"],
                    "file_id": file["id"],
                    "uploaded": True,
                    "file_type": "pds",
                }
            ],
        }

        serializer = EmployeeSerializer(data=employee)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "pds_link": f"https://drive.google.com/file/d/{file.get('id')}/view?usp=sharing"
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, pk=None, *args, **kwargs):
        if pk:
            employee = get_object_or_404(Employee, pk=pk)
            serializer = EmployeeSerializer(employee)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            category = request.query_params.get("category")
            if category == "ALL":
                employees = Employee.objects.all()
            else:
                employees = Employee.objects.filter(position=category)
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


class EmployeeCount(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        employees = Employee.objects.all()

        total_permanent = employees.filter(position="PERMANENT").count()
        total_casuals = employees.filter(position="CASUAL").count()
        total_job_orders = employees.filter(position="JOB ORDER").count()
        total_co_terminus = employees.filter(position="CO-TERMINUS").count()
        total_contract_of_service = employees.filter(
            position="CONTRACT OF SERVICE"
        ).count()
        total_temporary = employees.filter(position="TEMPORARY").count()

        return Response(
            {
                "total_permanent": total_permanent,
                "total_casual": total_casuals,
                "total_job_order": total_job_orders,
                "total_co_terminus": total_co_terminus,
                "total_contract_of_service": total_contract_of_service,
                "total_temporary": total_temporary,
            },
            status=status.HTTP_200_OK,
        )


class EmployeeFile(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self):
        folder = self.query_params.get("folder")
        files = get_file_to_folder(folder)

        return Response(files, status=status.HTTP_200_OK)
