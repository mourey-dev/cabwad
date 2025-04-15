import json
import os
from django.core.management.base import BaseCommand, CommandError
from employee.models import Employee
from service_record.models import ServiceRecord


class Command(BaseCommand):
    help = "Imports employee service records from JSON files"

    def add_arguments(self, parser):
        parser.add_argument(
            "json_path",
            type=str,
            help="Path to the JSON file or directory containing service record data",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Run the command without making actual changes to the database",
        )

    def handle(self, *args, **options):
        json_path = options["json_path"]
        dry_run = options.get("dry_run", False)

        # Check if path exists
        if not os.path.exists(json_path):
            raise CommandError(f"Path {json_path} does not exist")

        updated_count = 0
        skipped_count = 0
        errors = []
        file_count = 0

        # Process a directory of JSON files
        if os.path.isdir(json_path):
            self.stdout.write(self.style.SUCCESS(f"Processing directory: {json_path}"))

            # Get all JSON files in the directory
            json_files = [
                os.path.join(json_path, f)
                for f in os.listdir(json_path)
                if f.lower().endswith(".json")
            ]

            if not json_files:
                self.stdout.write(
                    self.style.WARNING(f"No JSON files found in {json_path}")
                )
                return

            self.stdout.write(self.style.SUCCESS(f"Found {len(json_files)} JSON files"))

            # Process each file
            for json_file in json_files:
                file_count += 1
                self.stdout.write(
                    f"Processing file {file_count}/{len(json_files)}: {os.path.basename(json_file)}"
                )

                try:
                    result = self.process_json_file(json_file, dry_run)
                    updated_count += result["updated"]
                    skipped_count += result["skipped"]
                    errors.extend(result["errors"])
                except Exception as e:
                    errors.append(f"Error processing file {json_file}: {e}")
                    skipped_count += 1

        # Process a single JSON file
        else:
            file_count = 1
            self.stdout.write(self.style.SUCCESS(f"Processing file: {json_path}"))

            try:
                result = self.process_json_file(json_path, dry_run)
                updated_count = result["updated"]
                skipped_count = result["skipped"]
                errors = result["errors"]
            except Exception as e:
                errors.append(f"Error processing file {json_path}: {e}")
                skipped_count += 1

        # Print summary
        self.stdout.write("\n" + "=" * 50)
        self.stdout.write(self.style.SUCCESS(f"Processed {file_count} JSON files"))

        if dry_run:
            self.stdout.write(
                self.style.WARNING("DRY RUN: No changes were made to the database")
            )
            self.stdout.write(
                self.style.SUCCESS(f"Would create {updated_count} service records")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully created {updated_count} service records"
                )
            )

        self.stdout.write(self.style.WARNING(f"Skipped {skipped_count} records"))

        if errors:
            self.stdout.write(self.style.ERROR("\nThe following errors occurred:"))
            for error in errors:
                self.stdout.write(self.style.ERROR(f"- {error}"))

    def process_json_file(self, json_file_path, dry_run):
        """Process a single JSON file containing service record data"""
        created_count = 0
        skipped_count = 0
        errors = []

        # Get the filename without extension to use as employee name reference
        filename = os.path.basename(json_file_path)
        employee_name = os.path.splitext(filename)[0]

        # Open and parse the JSON file
        try:
            with open(json_file_path, "r") as file:
                file_data = json.load(file)
        except json.JSONDecodeError as e:
            raise CommandError(f"Error parsing JSON file {filename}: {e}")

        # Extract employee_info from the JSON structure
        if not isinstance(file_data, dict) or "employee_info" not in file_data:
            errors.append(
                f"File {filename} does not contain expected 'employee_info' structure"
            )
            return {"updated": 0, "skipped": 1, "errors": errors}

        # Get the employee_info section
        employee_info = file_data["employee_info"]

        # Check for employee_id in employee_info
        if "employee_id" not in employee_info:
            errors.append(f"Missing employee_id in file {filename}")
            return {"updated": 0, "skipped": 1, "errors": errors}

        employee_id = employee_info["employee_id"]

        # Try to find the employee
        try:
            employee = Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            errors.append(
                f"Employee with ID {employee_id} not found (File: {filename}, Name: {employee_name})"
            )
            return {"updated": 0, "skipped": 1, "errors": errors}

        # Check for service_records section
        if "service_records" not in file_data:
            errors.append(f"Missing service_records section in file {filename}")
            return {"updated": 0, "skipped": 1, "errors": errors}

        # Handle null service_records
        if file_data["service_records"] is None:
            self.stdout.write(
                self.style.WARNING(
                    f"service_records is null in file {filename}. No records will be imported."
                )
            )
            return {"updated": 0, "skipped": 0, "errors": errors}

        # Ensure service_records is a list
        if not isinstance(file_data["service_records"], list):
            errors.append(f"service_records must be an array in file {filename}")
            return {"updated": 0, "skipped": 1, "errors": errors}

        service_records = file_data["service_records"]

        # If the list is empty, just log a warning
        if len(service_records) == 0:
            self.stdout.write(
                self.style.WARNING(
                    f"Empty service_records array in file {filename}. No records will be imported."
                )
            )
            return {"updated": 0, "skipped": 0, "errors": errors}

        # Check if we should delete existing records first
        if not dry_run:
            existing_count = ServiceRecord.objects.filter(employee=employee).count()
            if existing_count > 0:
                self.stdout.write(
                    self.style.WARNING(
                        f"Found {existing_count} existing service records for employee {employee_id}. "
                        f"These will be kept, and new records will be added."
                    )
                )

        # Process each service record
        for record in service_records:
            try:
                # Skip null records
                if record is None:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Skipping null record in service_records for employee {employee_id}"
                        )
                    )
                    skipped_count += 1
                    continue

                # Handle required fields with defaults - prevent any nulls by explicit checking
                service_from = (
                    "" if record.get("from") is None else record.get("from", "")
                )
                service_to = "" if record.get("to") is None else record.get("to", "")
                designation = (
                    ""
                    if record.get("designation") is None
                    else record.get("designation", "")
                )
                status = (
                    "" if record.get("status") is None else record.get("status", "")
                )
                station = (
                    "" if record.get("station") is None else record.get("station", "")
                )

                # Explicit handling for salary to ensure it's never null
                salary = ""
                if "salary" in record and record["salary"] is not None:
                    salary = record["salary"]

                # Explicit handling for absence to ensure it's never null
                absence = ""
                if "absence" in record and record["absence"] is not None:
                    absence = record["absence"]

                # Check if minimum required fields are present
                if not (service_from and designation):
                    self.stdout.write(
                        self.style.WARNING(
                            f"Skipping record with missing critical fields (from and designation) for employee {employee_id}"
                        )
                    )
                    skipped_count += 1
                    continue

                # Create the service record
                if not dry_run:
                    service_record = ServiceRecord(
                        employee=employee,
                        service_from=service_from,
                        service_to=service_to,
                        designation=designation,
                        status=status,
                        salary=salary,
                        station=station,
                        absence=absence,  # This will now always be a string, never null
                    )
                    service_record.save()

                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created service record for {employee.first_name} {employee.surname}: "
                        f"{designation} ({service_from} to {service_to or 'present'})"
                    )
                )

            except Exception as e:
                errors.append(f"Error creating service record: {str(e)}")
                skipped_count += 1

        return {"updated": created_count, "skipped": skipped_count, "errors": errors}
