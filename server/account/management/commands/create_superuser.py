from django.core.management.base import BaseCommand
from account.models import User
from datetime import datetime


class Command(BaseCommand):
    help = "Creates a default superuser with predefined credentials"

    def handle(self, *args, **options):
        try:
            # Default superuser details
            DEFAULT_EMAIL = "admin@cabwad.com"
            DEFAULT_FIRST_NAME = "Super"
            DEFAULT_LAST_NAME = "Admin"
            DEFAULT_BIRTHDATE = datetime(2025, 1, 1)  # 1990-01-01

            # Check if superuser already exists
            if User.objects.filter(email=DEFAULT_EMAIL).exists():
                self.stdout.write(
                    self.style.WARNING(
                        f"Superuser with email {DEFAULT_EMAIL} already exists."
                    )
                )
                return

            # Create superuser with default values
            superuser = User.objects.create_superuser(
                email=DEFAULT_EMAIL,
                birthdate=DEFAULT_BIRTHDATE,
                first_name=DEFAULT_FIRST_NAME,
                last_name=DEFAULT_LAST_NAME,
            )

            # Print user details
            self.stdout.write(
                self.style.SUCCESS(
                    f"\nDefault superuser created successfully:"
                    f"\nUsername: {superuser.username}"
                    f"\nPassword: 1990-01-01"
                    f"\nEmail: {superuser.email}"
                    f"\nIs Superuser: {superuser.is_superuser}"
                    f"\nIs Admin: {superuser.is_admin}"
                )
            )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error creating superuser: {str(e)}"))
