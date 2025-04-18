from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from datetime import datetime

from employee.models import Employee
from .models import ServiceRecord
from .serializers import ServiceRecordSerializer

import os
from pypdf import PdfReader, PdfWriter
import base64
from io import BytesIO
from pypdf.generic import NameObject


def format_date(date_value):
    """
    Format a date value to 'Month Day, Year' format (e.g., 'January 25, 2025')
    Handles None values, date objects, and string dates
    """
    if not date_value:
        return ""

    try:
        # If it's already a date object
        if hasattr(date_value, "strftime"):
            return date_value.strftime("%B %d, %Y")

        # If it's a string, try to parse it
        date_obj = datetime.strptime(str(date_value), "%Y-%m-%d")
        return date_obj.strftime("%B %d, %Y")
    except (ValueError, TypeError):
        # If parsing fails, return the original value
        return date_value


class ServiceRecordView(APIView):
    """
    API View for creating, retrieving, and updating employee service records.

    POST expects a payload matching the ServiceRecordForm structure:
    {
        "employee_id": string,
        "surname": string,
        "first_name": string,
        "middle_name": string,
        "date_of_birth": string,
        "place_of_birth": string,
        "service_records": [
            {
                "service_from": string,
                "service_to": string,
                "designation": string,
                "status": string,
                "salary": string,
                "station": string,
                "absence": string
            },
            ...
        ]
    }
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id=None, format=None):
        """
        Retrieve service records for an employee or get all service records
        if no employee_id is provided.
        """
        if employee_id:
            # Get a specific employee's service records
            try:
                employee = Employee.objects.get(employee_id=employee_id)
                service_records = ServiceRecord.get_records_for_employee(employee_id)

                # Get manager information from ServiceRecordManager
                try:
                    from .models import ServiceRecordManager

                    manager = ServiceRecordManager.get_instance()
                    division_manager_c = manager.division_manager_c or ""
                    general_manager = manager.general_manager or ""
                except Exception:
                    # Fallback if model doesn't exist or another error occurs
                    division_manager_c = ""
                    general_manager = ""

                # Format service records with properly formatted dates
                formatted_records = []
                for record in ServiceRecordSerializer(service_records, many=True).data:
                    # Format date fields in each service record
                    if "service_from" in record:
                        record["service_from"] = format_date(record["service_from"])
                    if "service_to" in record:
                        record["service_to"] = format_date(record["service_to"])
                    formatted_records.append(record)

                # Format the response with employee details and service records
                response_data = {
                    "employee_id": employee.employee_id,  # Use employee_id, not id
                    "surname": employee.surname,
                    "first_name": employee.first_name,
                    "middle_name": employee.middle_name,
                    "birth_date": format_date(employee.birth_date),
                    "birth_place": employee.birth_place,
                    "division_manager_c": division_manager_c,  # Match frontend type
                    "general_manager": general_manager,
                    "service_records": formatted_records,
                }
                return Response(response_data)
            except Employee.DoesNotExist:
                return Response(
                    {"error": f"Employee with ID {employee_id} not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            # Get all service records with pagination
            queryset = ServiceRecord.objects.all()

            # Basic pagination (consider using rest_framework pagination classes for advanced cases)
            page = int(request.query_params.get("page", 1))
            page_size = int(request.query_params.get("page_size", 10))
            start = (page - 1) * page_size
            end = start + page_size

            records = queryset[start:end]
            serialized_records = ServiceRecordSerializer(records, many=True).data

            # Format dates in all records
            for record in serialized_records:
                if "service_from" in record:
                    record["service_from"] = format_date(record["service_from"])
                if "service_to" in record:
                    record["service_to"] = format_date(record["service_to"])

            return Response({"count": queryset.count(), "results": serialized_records})

    def post(self, request, employee_id=None, format=None):
        """
        Create or update an employee's service records and optionally update manager info.
        """
        # Use employee_id from URL parameter or request data
        employee_id = employee_id or request.data.get("employee_id")

        if not employee_id:
            return Response(
                {"error": "Employee ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Find the employee
        try:
            employee = Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            return Response(
                {"error": f"Employee with ID {employee_id} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Update manager info if provided
        if "division_manager_c" in request.data or "general_manager" in request.data:
            try:
                from .models import ServiceRecordManager

                manager = ServiceRecordManager.get_instance()

                if "division_manager_c" in request.data:
                    manager.division_manager_c = request.data.get(
                        "division_manager_c", ""
                    )

                if "general_manager" in request.data:
                    manager.general_manager = request.data.get("general_manager", "")

                manager.save()
            except Exception as e:
                # Just log the error but continue processing service records
                print(f"Error updating manager info: {str(e)}")

        # Get all service records without filtering empty ones
        all_service_records = request.data.get("service_records", [])
        service_records_data = []

        # Process all records
        for record in all_service_records:
            # Simply prepare each record, keeping nulls as is
            cleaned_record = {
                "service_from": record.get("service_from", ""),
                "service_to": record.get("service_to", ""),
                "designation": record.get("designation", ""),
                "status": record.get("status", ""),
                "salary": record.get("salary", ""),
                "station": record.get("station", ""),
                "absence": record.get("absence", ""),
            }

            # If the record has an ID, include it for updating
            if record.get("id"):
                cleaned_record["id"] = record.get("id")

            service_records_data.append(cleaned_record)

        # Process service records only (don't touch employee data)
        created_updated_records = []

        # Process each non-empty service record
        for record_data in service_records_data:
            try:
                # Check if the record has an ID (existing record to update)
                if "id" in record_data:
                    record_id = record_data.pop("id")
                    try:
                        # Try to update the existing record
                        record = ServiceRecord.objects.get(id=record_id)
                        # Verify the record belongs to this employee
                        if record.employee.id != employee.id:
                            return Response(
                                {
                                    "error": f"Service record {record_id} does not belong to employee {employee_id}"
                                },
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                        for field, value in record_data.items():
                            setattr(record, field, value)
                        record.save()
                    except ServiceRecord.DoesNotExist:
                        # If it doesn't exist anymore, create a new one
                        record = ServiceRecord.objects.create(
                            employee=employee, **record_data
                        )
                else:
                    # Create a new service record linked to the employee
                    record = ServiceRecord.objects.create(
                        employee=employee, **record_data
                    )

                created_updated_records.append(ServiceRecordSerializer(record).data)
            except Exception as e:
                return Response(
                    {"error": f"Error processing service record: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Return the response including manager info
        return Response(
            {
                "employee_id": employee.employee_id,
                "service_records": created_updated_records,
                # Include manager info in the response
                "division_manager_c": ServiceRecordManager.get_instance().division_manager_c,
                "general_manager": ServiceRecordManager.get_instance().general_manager,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, record_id=None, format=None):
        """
        Update a specific service record by ID
        """
        if not record_id:
            return Response(
                {"error": "Service record ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get the record to update
        try:
            record = ServiceRecord.objects.get(id=record_id)
        except ServiceRecord.DoesNotExist:
            return Response(
                {"error": f"Service record with ID {record_id} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Update the record fields
        try:
            serializer = ServiceRecordSerializer(
                record, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Error updating service record: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ServiceRecordDetailView(APIView):
    """API View for retrieving, updating, or deleting individual service records"""

    permission_classes = [IsAuthenticated]

    def get_object(self, record_id):
        return get_object_or_404(ServiceRecord, id=record_id)

    def get(self, request, record_id, format=None):
        """Retrieve a single service record"""
        record = self.get_object(record_id)
        serializer = ServiceRecordSerializer(record)
        return Response(serializer.data)

    def put(self, request, record_id, format=None):
        """Update a single service record"""
        record = self.get_object(record_id)
        serializer = ServiceRecordSerializer(record, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, record_id, format=None):
        """Delete a service record"""
        record = self.get_object(record_id)
        record.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ServiceRecordPDF(APIView):
    permission_classes = [IsAuthenticated]
    base_path = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(base_path, "../static/service_record.pdf")

    def get(self, request, employee_id=None, format=None):
        """
        Generate a filled PDF service record for an employee and return as JSON with base64 encoded file
        """
        if not employee_id:
            return Response(
                {"error": "Employee ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get employee data
            employee = Employee.objects.get(employee_id=employee_id)
            service_records = ServiceRecord.get_records_for_employee(employee_id)

            # Get manager information
            try:
                from .models import ServiceRecordManager

                manager = ServiceRecordManager.get_instance()
                division_manager = manager.division_manager_c or ""
                general_manager = manager.general_manager or ""
            except Exception:
                division_manager = ""
                general_manager = ""

            # Prepare fillable fields dictionary
            fillable_fields = {
                "employee_id": employee.employee_id,
                "surname": employee.surname,
                "given_name": employee.first_name,
                "middle_name": employee.middle_name,
                "date_of_birth": format_date(employee.birth_date),
                "place_of_birth": employee.birth_place,
            }

            # Initialize all service record fields to empty strings
            for i in range(1, 22):
                fillable_fields[f"id_from_{i}"] = ""
                fillable_fields[f"id_to_{i}"] = ""
                fillable_fields[f"id_designated_{i}"] = ""
                fillable_fields[f"id_status_{i}"] = ""
                fillable_fields[f"id_salary_{i}"] = ""
                fillable_fields[f"id_assignment_{i}"] = ""
                fillable_fields[f"id_loa_{i}"] = ""

            # Fill service record fields with actual data
            for i, record in enumerate(service_records, 1):
                if i > 21:  # Maximum of 21 records can fit in the form
                    break

                fillable_fields[f"id_from_{i}"] = format_date(record.service_from)
                fillable_fields[f"id_to_{i}"] = format_date(record.service_to)
                fillable_fields[f"id_designated_{i}"] = record.designation
                fillable_fields[f"id_status_{i}"] = record.status
                fillable_fields[f"id_salary_{i}"] = record.salary
                fillable_fields[f"id_assignment_{i}"] = record.station
                fillable_fields[f"id_loa_{i}"] = record.absence

            # Use the provided PDF filling logic
            reader = PdfReader(self.input_path)
            writer = PdfWriter()

            # Copy pages from reader to writer
            for page in reader.pages:
                writer.add_page(page)

            # Copy the /AcroForm dictionary from reader to writer
            if "/AcroForm" in reader.trailer["/Root"]:
                writer._root_object.update(
                    {NameObject("/AcroForm"): reader.trailer["/Root"]["/AcroForm"]}
                )

            fields = reader.get_fields()

            # Fill form fields using correct field types
            for page_num, page in enumerate(writer.pages):
                for field_name, field in fields.items():
                    if field_name in fillable_fields:
                        field_type = field.get("/FT")
                        if field_type == "/Btn":  # Checkbox field
                            value = fillable_fields.get(field_name, "")
                            writer.update_page_form_field_values(
                                page,
                                {
                                    field_name: f"/{value.lower() if not isinstance(value, bool) else ''}"
                                },
                            )
                        else:
                            value = fillable_fields.get(field_name, "")
                            writer.update_page_form_field_values(
                                page,
                                {
                                    field_name: value
                                    if value and len(str(value)) > 0
                                    else ""
                                },
                            )

            # Save the modified PDF to a BytesIO object
            output_pdf = BytesIO()
            writer.write(output_pdf)
            output_pdf.seek(0)

            # Convert to base64 for response
            pdf_data = output_pdf.getvalue()
            pdf_base64 = base64.b64encode(pdf_data).decode("utf-8")

            # Return JSON response with base64 encoded PDF
            response_data = {
                "filename": f"service_record_{employee_id}.pdf",
                "mime_type": "application/pdf",
                "data": pdf_base64,
                "employee_id": employee.employee_id,
                "employee_name": f"{employee.first_name} {employee.surname}",
            }

            return Response(response_data)

        except Employee.DoesNotExist:
            return Response(
                {"error": f"Employee with ID {employee_id} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"error": f"Error generating PDF: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
