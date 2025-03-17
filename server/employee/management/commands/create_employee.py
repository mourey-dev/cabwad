from django.core.management.base import BaseCommand
from employee.serializers import EmployeeSerializer
from datetime import datetime
from services.drive_services import create_folder
import json


class Command(BaseCommand):
    help = "Creates a new employee from JSON data"

    def get_civil_status(self, data):
        if data.get("p_civil_single"):
            return "SINGLE"
        elif data.get("p_civil_married"):
            return "MARRIED"
        elif data.get("p_civil_widowed"):
            return "WIDOWED"
        elif data.get("p_civil_separated"):
            return "SEPARATED"
        elif data.get("p_civil_others"):
            return "OTHERS"
        return "SINGLE"  # default value

    def get_sex(self, data):
        if data.get("p_sex_male"):
            return "MALE"
        elif data.get("p_sex_female"):
            return "FEMALE"
        return "MALE"  # default value

    def convert_date(self, date_string):
        if not date_string:
            return None
        return datetime.strptime(date_string, "%Y-%m-%d").date()

    def add_arguments(self, parser):
        parser.add_argument(
            "json_file", type=str, help="Path to JSON file containing employee data"
        )

    def handle(self, *args, **options):
        try:
            # Read JSON file
            with open(options["json_file"], "r") as file:
                employees_data = json.load(file)

            if not isinstance(employees_data, list):
                raise ValueError("JSON data must be a list of employees")

            success_count = 0
            for data in employees_data:
                try:
                    # Prepare data for serializer
                    employee_data = {
                        "employee_id": data.get("employee_id"),
                        "first_name": data.get("p_first_name", "").upper(),
                        "surname": data.get("p_surname", "").upper(),
                        "middle_name": data.get("p_middle_name", "").upper(),
                        "appointment_status": data.get(
                            "appointment_status", "PERMANENT"
                        ),
                        "position": data.get("position", "").upper(),
                        "department": data.get("department", "").upper(),
                        "civil_status": self.get_civil_status(data),
                        "birth_date": self.convert_date(data.get("p_birth_date")),
                        "first_day_service": self.convert_date(
                            data.get("first_day_service")
                        ),
                        "civil_service": data.get("civil_service_eligibility", ""),
                        "sex": self.get_sex(data),
                        "phone": data.get("phone", ""),
                        "email": data.get("email", ""),
                        "files": [],  # Add empty files list since it's required by serializer
                    }

                    # Create folder in Drive
                    folder_name = (
                        f"{employee_data['first_name']} {employee_data['surname']}"
                    )
                    folder_id = create_folder(
                        folder_name.upper(), "1bXWiVgFCnq7J93SjKjkeeGBX1uOFN30G"
                    )
                    employee_data["folder_id"] = folder_id

                    # Validate and create employee using serializer
                    serializer = EmployeeSerializer(data=employee_data)
                    if serializer.is_valid():
                        employee = serializer.save()
                        success_count += 1
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"Created employee {employee.employee_id}"
                            )
                        )
                    else:
                        self.stdout.write(
                            self.style.WARNING(
                                f"Failed to create employee {data.get('employee_id')}: {serializer.errors}"
                            )
                        )

                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Failed to create employee {data.get('employee_id')}: {str(e)}"
                        )
                    )

            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully created {success_count} out of {len(employees_data)} employees"
                )
            )

        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(f"JSON file not found: {options['json_file']}")
            )
        except json.JSONDecodeError:
            self.stdout.write(
                self.style.ERROR(f"Invalid JSON format in file: {options['json_file']}")
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error processing file: {str(e)}"))
