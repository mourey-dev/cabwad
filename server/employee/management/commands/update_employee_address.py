from django.core.management.base import BaseCommand
from employee.models import Employee
import json
import csv


class Command(BaseCommand):
    help = "Updates employee addresses from a file (JSON or CSV)"

    def add_arguments(self, parser):
        parser.add_argument(
            "file_path",
            type=str,
            help="Path to JSON or CSV file containing employee address data",
        )
        parser.add_argument(
            "--format",
            type=str,
            choices=["json", "csv"],
            default="json",
            help="File format: json or csv (default: json)",
        )
        parser.add_argument(
            "--employee_id",
            type=str,
            help="Update a specific employee by ID instead of using a file",
        )
        parser.add_argument(
            "--address", type=str, help="New address when updating a specific employee"
        )

    def handle(self, *args, **options):
        # Handle single employee update
        if options.get("employee_id") and options.get("address"):
            self.update_single_employee(options["employee_id"], options["address"])
            return

        # Handle bulk update from file
        file_path = options["file_path"]
        file_format = options["format"]

        try:
            if file_format == "json":
                self.process_json_file(file_path)
            else:
                self.process_csv_file(file_path)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File not found: {file_path}"))
        except json.JSONDecodeError:
            self.stdout.write(
                self.style.ERROR(f"Invalid JSON format in file: {file_path}")
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error processing file: {str(e)}"))

    def update_single_employee(self, employee_id, new_address):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            old_address = employee.address
            employee.address = new_address
            employee.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f"Updated address for employee {employee_id} from '{old_address}' to '{new_address}'"
                )
            )
        except Employee.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f"Employee with ID {employee_id} not found")
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error updating employee {employee_id}: {str(e)}")
            )

    def process_json_file(self, file_path):
        with open(file_path, "r") as file:
            data = json.load(file)

        if not isinstance(data, list):
            raise ValueError("JSON data must be a list of employee records")

        success_count = 0
        error_count = 0

        for item in data:
            employee_id = item.get("employee_id")
            new_address = item.get("address")

            if not employee_id or not new_address:
                self.stdout.write(
                    self.style.WARNING(
                        f"Skipping record: Missing employee_id or address"
                    )
                )
                error_count += 1
                continue

            try:
                employee = Employee.objects.get(employee_id=employee_id)
                old_address = employee.address
                employee.address = new_address
                employee.save()
                success_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Updated address for employee {employee_id} from '{old_address}' to '{new_address}'"
                    )
                )
            except Employee.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f"Employee with ID {employee_id} not found")
                )
                error_count += 1
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(
                        f"Error updating employee {employee_id}: {str(e)}"
                    )
                )
                error_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully updated {success_count} employee addresses with {error_count} errors"
            )
        )

    def process_csv_file(self, file_path):
        success_count = 0
        error_count = 0

        with open(file_path, "r", newline="") as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                employee_id = row.get("employee_id")
                new_address = row.get("address")

                if not employee_id or not new_address:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Skipping record: Missing employee_id or address"
                        )
                    )
                    error_count += 1
                    continue

                try:
                    employee = Employee.objects.get(employee_id=employee_id)
                    old_address = employee.address
                    employee.address = new_address
                    employee.save()
                    success_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Updated address for employee {employee_id} from '{old_address}' to '{new_address}'"
                        )
                    )
                except Employee.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(f"Employee with ID {employee_id} not found")
                    )
                    error_count += 1
                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Error updating employee {employee_id}: {str(e)}"
                        )
                    )
                    error_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully updated {success_count} employee addresses with {error_count} errors"
            )
        )
