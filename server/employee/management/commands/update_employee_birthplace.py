import json
import os
from django.core.management.base import BaseCommand, CommandError
from employee.models import Employee


class Command(BaseCommand):
    help = "Updates employee birth places from JSON files"

    def add_arguments(self, parser):
        parser.add_argument(
            "json_path",
            type=str,
            help="Path to the JSON file or directory containing employee birth place data",
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
                self.style.SUCCESS(f"Would update {updated_count} employees")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f"Successfully updated {updated_count} employees")
            )

        self.stdout.write(self.style.WARNING(f"Skipped {skipped_count} employees"))

        if errors:
            self.stdout.write(self.style.ERROR("\nThe following errors occurred:"))
            for error in errors:
                self.stdout.write(self.style.ERROR(f"- {error}"))

    def process_json_file(self, json_file_path, dry_run):
        """Process a single JSON file containing employee birth place data"""
        updated_count = 0
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

        # Handle both single objects and arrays for employee_info
        if isinstance(employee_info, list):
            employees = employee_info
        else:
            employees = [employee_info]  # Convert single object to list

        # Process each employee
        for emp_data in employees:
            try:
                # Check for required fields
                if "employee_id" not in emp_data:
                    errors.append(f"Missing employee_id in file {filename}: {emp_data}")
                    skipped_count += 1
                    continue

                employee_id = emp_data["employee_id"]

                # Check for birth_place field (allow it to be missing or empty)
                birth_place = ""
                if "birth_place" in emp_data:
                    birth_place = emp_data["birth_place"] or ""
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Birth place not specified in file {filename} for employee {employee_id}. Using empty string."
                        )
                    )

                # Try to find the employee
                try:
                    employee = Employee.objects.get(employee_id=employee_id)
                except Employee.DoesNotExist:
                    # Include the filename (typically the employee's name) in the error message
                    errors.append(
                        f"Employee with ID {employee_id} not found (File: {filename}, Name: {employee_name})"
                    )
                    skipped_count += 1
                    continue

                # Update the birth place (even if it's empty)
                if not dry_run:
                    # Standardize capitalization for consistency (if not empty)
                    standardized_birth_place = (
                        self.standardize_place_name(birth_place) if birth_place else ""
                    )
                    employee.birth_place = standardized_birth_place
                    employee.save(update_fields=["birth_place"])

                updated_count += 1

                # Different message based on whether birth place was set or cleared
                if birth_place:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Updated birth place for employee {employee.id} ({employee.first_name} {employee.surname}) "
                            f"to '{birth_place if dry_run else standardized_birth_place}'"
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Cleared birth place for employee {employee.id} ({employee.first_name} {employee.surname})"
                        )
                    )

            except Exception as e:
                errors.append(
                    f"Error processing employee {emp_data.get('employee_id', 'unknown')} "
                    f"(File: {filename}, Name: {employee_name}): {e}"
                )
                skipped_count += 1

        return {"updated": updated_count, "skipped": skipped_count, "errors": errors}

    def standardize_place_name(self, place_name):
        """
        Standardize the capitalization of place names
        e.g. "manila city" -> "Manila City"
        """
        # Keep the existing implementation
        if not place_name:
            return ""

        # Split by common separators
        words = []
        for part in place_name.split(","):
            words.extend(part.strip().split())

        # List of words that should remain lowercase unless at beginning
        lowercase_words = {"of", "the", "in", "on", "at", "and", "by", "for", "with"}

        # Capitalize each word correctly
        capitalized = []
        for i, word in enumerate(words):
            # Always capitalize first word or after a comma
            if i == 0 or words[i - 1].endswith(","):
                capitalized.append(word.capitalize())
            # Keep certain words lowercase unless they're first
            elif word.lower() in lowercase_words:
                capitalized.append(word.lower())
            # Special case for "Mc" and "Mac" surnames
            elif word.lower().startswith("mc") and len(word) > 2:
                capitalized.append("Mc" + word[2:].capitalize())
            elif word.lower().startswith("mac") and len(word) > 3:
                capitalized.append("Mac" + word[3:].capitalize())
            # Handle hyphenated words
            elif "-" in word:
                capitalized.append("-".join(w.capitalize() for w in word.split("-")))
            # Regular capitalization
            else:
                capitalized.append(word.capitalize())

        # Rejoin with appropriate spacing
        result = ""
        for i, word in enumerate(capitalized):
            if i > 0 and not result.endswith(","):
                result += " "
            result += word

        return result
