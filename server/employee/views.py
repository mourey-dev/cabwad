from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import JSONParser

from .utils.update_dict_key import update_dict_key
from .utils.create_pds import create_pds
from .utils.destructure_dict import destructure_dict

from .models import Employee, File, FileType
from .serializers import EmployeeSerializer

from .utils.file_handler import file64_to_file

from services.drive_services import (
    get_file_to_folder,
    upload_to_drive,
    delete_file,
    update_file,
)

import base64
from io import BytesIO


def get_civil_status(data):
    if data.get("p_civil_single"):
        return "Single"
    if data.get("p_civil_widowed"):
        return "Widowed"
    if data.get("p_civil_married"):
        return "Married"
    if data.get("p_civil_separated"):
        return "Separated"
    if data.get("p_civil_other"):
        return "Other"
    return ""


def get_sex(data):
    if data.get("p_sex_male"):
        return "MALE"
    if data.get("p_sex_female"):
        return "FEMALE"
    return ""


def to_uppercase(data):
    if isinstance(data, dict):
        return {key: to_uppercase(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [to_uppercase(item) for item in data]
    elif isinstance(data, str):
        return data.upper()
    else:
        return data


class PDSView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        data = to_uppercase(request.data)
        profile = request.data.get("other_information").pop("of_profile")

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

        if profile:
            file_io = file64_to_file(profile)  # Changed from file to profile
            file_name = f"{'Profile'}_{combined_data.get('p_surname')}".upper()
            folder_id = pds["folder_id"]
            file_info = upload_to_drive(
                file_io, file_name, folder_id
            )  # Removed empty string parameter
            profile_data = {
                "name": file_info["name"],
                "file_id": file_info["id"],
                "uploaded": True,
                "file_type": "profile",
            }
        else:
            profile_data = None  # Handle case when there's no profile

        employee = {
            "employee_id": data["employee_id"],
            "first_name": combined_data["p_first_name"],
            "surname": combined_data["p_surname"],
            "middle_name": data.get("middle_name", ""),
            "appointment_status": data.get("employment_status", ""),
            "position": data["position"],
            "department": data["department"],
            "civil_status": get_civil_status(combined_data),
            "folder_id": pds["folder_id"],
            "birth_date": combined_data.get("p_birth_date", ""),
            "first_day_service": data["first_day_service"],
            "sex": get_sex(combined_data),
            "phone": combined_data["p_mobile"],
            "email": combined_data["p_email"],
            "files": [
                {
                    "name": file["name"],
                    "file_id": file["id"],
                    "uploaded": True,
                    "file_type": "pds",
                },
            ]
            + (
                [profile_data] if profile_data else []
            ),  # Only add profile_data if it exists
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
                employees = Employee.objects.filter(appointment_status=category)
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk=None, *args, **kwargs):
        if not pk:
            return Response(
                {"detail": "Employee ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        employee = get_object_or_404(Employee, pk=pk)
        serializer = EmployeeSerializer(employee, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "detail": "Employee updated successfully",
                    "employee": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeCount(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        employees = Employee.objects.all()

        total_permanent = employees.filter(appointment_status="PERMANENT").count()
        total_casuals = employees.filter(appointment_status="CASUAL").count()
        total_job_orders = employees.filter(appointment_status="JOB ORDER").count()
        total_co_terminus = employees.filter(appointment_status="CO-TERMINUS").count()
        total_contract_of_service = employees.filter(
            appointment_status="CONTRACT OF SERVICE"
        ).count()
        total_temporary = employees.filter(appointment_status="TEMPORARY").count()

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
    parser_classes = [JSONParser]

    def get(self, request):
        folder = request.query_params.get("folder")
        files = get_file_to_folder(folder)
        return Response(files, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        payload = data.get("payload")
        employee = data.get("employee")

        # Get the file name from the FileType enum
        file_name = (
            f"{FileType[data.get('file_type')].value}_{employee.get('surname')}".upper()
        )

        file_io = file64_to_file(payload)

        # Save the file to Google Drive or any other storage
        folder_id = employee.get("folder_id")
        file_info = upload_to_drive(file_io, file_name, folder_id)

        # Create a new File instance
        new_file = File.objects.create(
            name=file_info["name"],
            file_id=file_info["id"],
            uploaded=True,
            file_type=data.get("file_type"),
        )

        # Update the employee's file information
        employee_instance = get_object_or_404(
            Employee, employee_id=employee["employee_id"]
        )
        employee_instance.files.add(new_file)
        employee_instance.save()

        # Serialize the file object for the response
        file_data = {
            "name": new_file.name,
            "file_id": new_file.file_id,
            "uploaded": new_file.uploaded,
            "file_type": new_file.file_type,
        }

        return Response(
            {
                "detail": "File uploaded successfully",
                "employee_file": file_data,
            },
            status=status.HTTP_201_CREATED,
        )

    def put(self, request):
        data = request.data
        payload = data.get("payload")
        file_content = payload.get("fileContent")
        file_type = data.get("file_type")  # This should be the FileType enum value
        employee = data.get("employee")
        file_id = data.get("file_id")

        if not file_content or not employee or not file_id:
            return Response(
                {"detail": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Get the file name from the FileType enum
        try:
            file_name = f"{FileType[file_type].value}_{employee.get('surname')}".upper()
        except KeyError:
            return Response(
                {"detail": "Invalid file type"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Decode the base64 file content
        file_data = base64.b64decode(file_content.split(",")[1])
        file_io = BytesIO(file_data)

        # Update the file on Google Drive
        file_info = update_file(file_id, file_io, file_name)

        # Update the File instance in the database
        file_instance = get_object_or_404(File, file_id=file_id)
        file_instance.name = file_info["name"]
        file_instance.file_id = file_info["id"]
        file_instance.file_type = file_type
        file_instance.save()

        # Prepare the response data
        updated_file_data = {
            "name": file_instance.name,
            "file_id": file_instance.file_id,
            "uploaded": file_instance.uploaded,
            "file_type": file_instance.file_type,
        }

        return Response(
            {"detail": "File updated successfully", "employee_file": updated_file_data},
            status=status.HTTP_200_OK,
        )

    def delete(self, request):
        data = request.data
        employee = data.get("employee")
        employee_id = employee.get("employee_id")
        file_id = data.get("file_id")

        if not employee_id or not file_id:
            return Response(
                {"detail": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Get the employee instance
        employee_instance = get_object_or_404(Employee, employee_id=employee_id)

        # Get the file instance
        file_instance = get_object_or_404(File, file_id=file_id)

        # Store file data before deletion for response
        file_data = {
            "name": file_instance.name,
            "file_id": file_instance.file_id,
            "uploaded": file_instance.uploaded,
            "file_type": file_instance.file_type,
        }

        # Remove the file from the employee's files
        employee_instance.files.remove(file_instance)

        # Delete the file from Google Drive
        delete_file(file_id)

        # Delete the file instance from the database
        file_instance.delete()

        return Response(
            {"detail": "File deleted successfully", "employee_file": file_data},
            status=status.HTTP_200_OK,
        )
