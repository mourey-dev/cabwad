from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from datetime import datetime

from employee.models import Employee
from .models import ServiceRecord
from .serializers import ServiceRecordSerializer


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
                service_records = ServiceRecord.objects.filter(employee=employee)

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
                    "employee_id": employee.id,
                    "surname": employee.surname,
                    "first_name": employee.first_name,
                    "middle_name": employee.middle_name,
                    "birth_date": format_date(
                        employee.birth_date
                    ),  # Format the birth date
                    "birth_place": employee.birth_place,
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
        Create or update an employee's service records.
        If employee_id is provided in the URL, it takes precedence over the request body.
        This method only updates service records, not employee information.
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

        # Return only the service records without employee data
        return Response(
            {
                "employee_id": employee.employee_id,
                "service_records": created_updated_records,
            },
            status=status.HTTP_200_OK,  # 200 OK for updates
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
