from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.parsers import JSONParser

from .helper.pds_builder import PDSBuilder

from .models import Employee, File, FileType
from .serializers import EmployeeSerializer

from pds.mixins import CompletePdsMixin

from .utils.file_handler import file64_to_file

from services.drive_services import (
    get_file_to_folder,
    create_folder,
    upload_to_drive,
    delete_file,
    update_file,
)

import base64
from io import BytesIO

from account.permissions import IsAdminOrSuperAdmin
from .pagination import EmployeePagination


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


class PDSView(CompletePdsMixin, APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrSuperAdmin]

    def get(self, request, employee_id):
        """Get complete PDS data for an employee"""
        employee = self.get_employee(employee_id)
        data = self.get_complete_pds_data(employee)
        return Response(data)

    def post(self, request):
        try:
            # Get profile data if available
            other_information = request.data.get("other_information", {})
            profile = other_information.get("profile", "") if other_information else ""

            # Convert data to uppercase for consistency
            data = to_uppercase(request.data)

            # Step 1. Extract personal information
            personal_information = data.get("personal_information", {})
            if not personal_information:
                return Response(
                    {"detail": "Personal information is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Prepare employee data
            employee_id = data.get("employee_id", "")

            # Check if employee already exists
            existing_employee = None
            if employee_id:
                try:
                    existing_employee = Employee.objects.get(employee_id=employee_id)
                except Employee.DoesNotExist:
                    existing_employee = None

            if existing_employee:
                # If employee exists, use their folder_id
                folder_id = existing_employee.folder_id
                if not folder_id:
                    return Response(
                        {"detail": "Existing employee has no associated folder"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # For existing employee, just create the PDS file
                try:
                    # Create PDS File
                    pds_builder = (
                        PDSBuilder(data)
                        .update_pds_data()
                        .destruct_pds_data()
                        .update()
                        .create_pds()
                    )
                    pds = pds_builder.build()

                    file_name = f"PERSONAL DATA SHEET_{personal_information.get('p_surname', '')}, {personal_information.get('p_first_name', '')}"

                    # Check if existing PDS file already exists
                    pds_file = None
                    for file in existing_employee.files.all():
                        if file.file_type.lower() == "pds":
                            pds_file = file
                            break

                    if pds_file:
                        # Update existing PDS file
                        g_file = update_file(pds_file.file_id, pds, file_name)

                        # Update file record
                        pds_file.name = g_file["name"]
                        pds_file.save()
                    else:
                        # Upload new PDS file
                        g_file = upload_to_drive(pds, file_name, folder_id)

                        if not g_file or "id" not in g_file:
                            return Response(
                                {"detail": "Failed to upload PDS file to Google Drive"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            )

                        # Create and attach new File record
                        new_file = File.objects.create(
                            name=g_file["name"],
                            file_id=g_file["id"],
                            uploaded=True,
                            file_type="pds",
                        )

                        existing_employee.files.add(new_file)

                    self.save_pds_data(employee_id, request.data)
                    return Response(
                        {
                            "detail": "PDS created successfully for existing employee",
                            "pds_link": f"https://drive.google.com/file/d/{g_file.get('id')}/view?usp=sharing",
                        },
                        status=status.HTTP_200_OK,
                    )

                except Exception as e:
                    return Response(
                        {"detail": f"PDS creation error: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            else:
                # For new employee, prepare the full employee data
                employee = {
                    "employee_id": employee_id,
                    "first_name": personal_information.get("p_first_name", ""),
                    "surname": personal_information.get("p_surname", ""),
                    "middle_name": personal_information.get("p_middle_name", ""),
                    "appointment_status": data.get("employment_status", ""),
                    "position": data.get("position", ""),
                    "department": data.get("department", ""),
                    "civil_status": get_civil_status(personal_information),
                    "birth_date": personal_information.get("p_birth_date", ""),
                    "first_day_service": data.get("first_day_service"),
                    "sex": get_sex(personal_information),
                    "phone": personal_information.get("p_mobile", ""),
                    "email": personal_information.get("p_email", ""),
                    "civil_service": data.get("civil_service", ""),
                }

                # Validate employee data
                serializer = EmployeeSerializer(data=employee)
                if not serializer.is_valid():
                    return Response(
                        serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )

                # Step 2. Create Folder for employee
                try:
                    folder_name = f"{personal_information.get('p_surname', '')}, {personal_information.get('p_first_name', '')}"
                    folder_id = create_folder(folder_name)
                    if not folder_id:
                        return Response(
                            {"detail": "Failed to create folder in Google Drive"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )
                except Exception as e:
                    return Response(
                        {"detail": f"Folder creation error: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

                # Step 3. Create PDS File
                try:
                    pds_builder = (
                        PDSBuilder(data)
                        .update_pds_data()
                        .destruct_pds_data()
                        .update()
                        .create_pds()
                    )
                    pds = pds_builder.build()

                    file_name = f"PERSONAL DATA SHEET_{personal_information.get('p_surname', '')}, {personal_information.get('p_first_name', '')}"
                    g_file = upload_to_drive(pds, file_name, folder_id)

                    if not g_file or "id" not in g_file:
                        return Response(
                            {"detail": "Failed to upload PDS file to Google Drive"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )
                except Exception as e:
                    return Response(
                        {"detail": f"PDS creation error: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

                # Initialize files list with PDS file
                files_list = [
                    {
                        "name": g_file["name"],
                        "file_id": g_file["id"],
                        "uploaded": True,
                        "file_type": "pds",
                    }
                ]

                # Step 4. Upload Profile if provided
                profile_data = None
                if profile:
                    try:
                        file_io = file64_to_file(profile)
                        if not file_io:
                            return Response(
                                {"detail": "Invalid profile image data"},
                                status=status.HTTP_400_BAD_REQUEST,
                            )

                        file_name = f"PROFILE_{personal_information.get('p_surname', '')}, {personal_information.get('p_first_name', '')}"
                        file_info = upload_to_drive(file_io, file_name, folder_id)

                        if file_info and "id" in file_info:
                            profile_data = {
                                "name": file_info["name"],
                                "file_id": file_info["id"],
                                "uploaded": True,
                                "file_type": "profile",
                            }
                            files_list.append(profile_data)
                    except Exception as e:
                        # Continue even if profile upload fails
                        print(f"Profile upload error: {str(e)}")

                # Update employee data with folder ID
                employee["folder_id"] = folder_id

                # Save employee to database
                serializer = EmployeeSerializer(data=employee)
                if not serializer.is_valid():
                    # Clean up Drive files if employee save fails
                    try:
                        for file_item in files_list:
                            delete_file(file_item["file_id"])
                    except Exception:
                        pass

                    return Response(
                        serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )

                emp_instance = serializer.save()

                # Add files to the employee
                for file_data in files_list:
                    file = File.objects.create(
                        name=file_data["name"],
                        file_id=file_data["file_id"],
                        uploaded=file_data["uploaded"],
                        file_type=file_data["file_type"],
                    )
                    emp_instance.files.add(file)

                self.save_pds_data(employee_id, request.data)

                return Response(
                    {
                        "detail": "Employee created successfully",
                        "pds_link": f"https://drive.google.com/file/d/{g_file.get('id')}/view?usp=sharing",
                    },
                    status=status.HTTP_201_CREATED,
                )

        except Exception as e:
            return Response(
                {"detail": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def put(self, request):
        """Update PDS for an existing employee"""
        try:
            employee_id = request.data.get("employee_id")
            if not employee_id:
                return Response(
                    {"detail": "Employee ID is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get the employee
            try:
                employee = self.get_employee(employee_id)
            except Exception as e:
                return Response(
                    {"detail": f"Employee not found: {str(e)}"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Convert data to uppercase for consistency
            data = to_uppercase(request.data)
            personal_information = data.get("personal_information", {})

            # Validate personal information
            if not personal_information:
                return Response(
                    {"detail": "Personal information is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if employee has a folder
            folder_id = employee.folder_id
            if not folder_id:
                return Response(
                    {"detail": "Employee has no associated folder"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if PDS file already exists
            pds_file = None
            for file in employee.files.all():
                if file.file_type.lower() == "pds":
                    pds_file = file
                    break

            # Require existing PDS file for update
            if not pds_file:
                return Response(
                    {
                        "detail": "No PDS file found to update. Use POST to create new PDS."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            try:
                self.save_pds_data(employee_id, request.data)

                # Create PDS File
                pds_builder = (
                    PDSBuilder(data)
                    .update_pds_data()
                    .destruct_pds_data()
                    .update()
                    .create_pds()
                )
                pds = pds_builder.build()

                # Create file name
                file_name = f"PERSONAL DATA SHEET_{personal_information.get('p_surname', '')}, {personal_information.get('p_first_name', '')}"

                g_file = update_file(pds_file.file_id, pds, file_name)

                # Update file record with new ID from replacement file
                pds_file.file_id = g_file["id"]
                pds_file.name = g_file["name"]
                pds_file.save()
            except Exception as e:
                if "File not found" in str(e) or "404" in str(e):
                    # If file no longer exists in Drive, upload as replacement
                    g_file = upload_to_drive(pds, file_name, folder_id)

                    if not g_file or "id" not in g_file:
                        return Response(
                            {
                                "detail": "Failed to upload replacement PDS file to Google Drive"
                            },
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        )

                    # Update file record with new ID
                    pds_file.file_id = g_file["id"]
                    pds_file.name = g_file["name"]
                    pds_file.save()
                else:
                    # Other error occurred
                    return Response(
                        {"detail": f"PDS file update error: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )

            return Response(
                {
                    "detail": "PDS updated successfully",
                    "pds_link": f"https://drive.google.com/file/d/{g_file.get('id')}/view?usp=sharing",
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"detail": f"PDS update error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class EmployeeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrSuperAdmin]
    pagination_class = EmployeePagination

    def get(self, request, pk=None, *args, **kwargs):
        employee_id = kwargs.get("employee_id", "")

        if employee_id:
            employee = get_object_or_404(Employee, employee_id=employee_id)
            serializer = EmployeeSerializer(employee)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            category = request.query_params.get("category")
            is_active = request.query_params.get("is_active")
            search_query = request.query_params.get("search", "")

            # Build filter conditions
            filters = {}
            if category and category != "ALL":
                filters["appointment_status"] = category
            if is_active is not None:
                filters["is_active"] = is_active.lower() == "true"

            # Get all employees that match the filters
            employees = Employee.objects.filter(**filters)

            # Apply search filter if provided
            if search_query:
                # Case-insensitive search across name fields
                employees = employees.filter(
                    Q(first_name__icontains=search_query)
                    | Q(surname__icontains=search_query)
                    | Q(middle_name__icontains=search_query)
                )

            # Initialize paginator
            paginator = self.pagination_class()
            paginated_employees = paginator.paginate_queryset(employees, request)

            serializer = EmployeeSerializer(paginated_employees, many=True)
            return paginator.get_paginated_response(serializer.data)

    def put(self, request, *args, **kwargs):
        employee_id = kwargs.get("employee_id", "")

        if not employee_id:
            return Response(
                {"detail": "Employee ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        employee = get_object_or_404(Employee, employee_id=employee_id)
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

    def patch(self, request, *args, **kwargs):
        """
        Toggle employee active status or update specific status.
        Used for activating/deactivating employees.
        """
        employee_id = request.data.get("employee_id", None)
        action = request.data.get(
            "action", "toggle"
        )  # 'activate', 'deactivate', or 'toggle'

        if not employee_id:
            return Response(
                {"detail": "Employee ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        employee = get_object_or_404(Employee, employee_id=employee_id)

        # Update is_active based on the specified action
        if action == "activate":
            employee.is_active = True
        elif action == "deactivate":
            employee.is_active = False
        else:  # default to toggle
            employee.is_active = not employee.is_active

        employee.save()

        # Get the appropriate action message
        action_message = "activated" if employee.is_active else "deactivated"

        serializer = EmployeeSerializer(employee)
        return Response(
            {
                "detail": f"Employee {action_message} successfully",
                "employee": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, *args, **kwargs):
        employee_id = request.data.get("employee_id", None)

        if not employee_id:
            return Response(
                {"detail": "Employee ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        employee = get_object_or_404(Employee, employee_id=employee_id)
        employee.is_active = not employee.is_active  # Toggle the is_active field
        employee.save()

        serializer = EmployeeSerializer(employee)
        action = "activated" if employee.is_active else "deactivated"

        return Response(
            {
                "detail": f"Employee {action} successfully",
                "employee": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class EmployeeCount(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrSuperAdmin]

    def get(self, request):
        employees = Employee.objects.all()

        total_permanent = employees.filter(
            appointment_status="PERMANENT", is_active=True
        ).count()
        total_casuals = employees.filter(
            appointment_status="CASUAL", is_active=True
        ).count()
        total_job_orders = employees.filter(
            appointment_status="JOB ORDER", is_active=True
        ).count()
        total_co_terminus = employees.filter(
            appointment_status="CO-TERMINUS", is_active=True
        ).count()
        total_contract_of_service = employees.filter(
            appointment_status="CONTRACT OF SERVICE", is_active=True
        ).count()
        total_temporary = employees.filter(
            appointment_status="TEMPORARY", is_active=True
        ).count()

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


class EmployeeFile(CompletePdsMixin, APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminOrSuperAdmin]
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

        # Check if the file is a PDS file
        if file_instance.file_type.lower() == "pds":
            self.delete_pds_data(employee_instance)

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
