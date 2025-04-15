from django.db import models
from django.db.models import Case, When, Value, IntegerField
from employee.models import Employee


class ServiceRecord(models.Model):
    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="service_records"
    )

    service_from = models.CharField(max_length=50, blank=True, null=True)
    service_to = models.CharField(max_length=50, blank=True, null=True)
    designation = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=100, blank=True, null=True)
    salary = models.CharField(max_length=100, blank=True, null=True)
    station = models.CharField(max_length=255, blank=True, null=True)
    absence = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        # Use a simpler default ordering that doesn't rely on annotations
        ordering = ["service_from"]

    def __str__(self):
        return f"{self.employee.full_name} - {self.designation} ({self.service_from})"

    @staticmethod
    def get_ordered_queryset(queryset):
        """
        Return queryset ordered by parsed date components
        """
        # Create order for common "Present" or empty values
        return queryset.annotate(
            service_from_date_parts=Case(
                When(service_from__isnull=True, then=Value(0)),
                When(service_from="", then=Value(0)),
                default=Value(1),
                output_field=IntegerField(),
            )
        ).order_by("-service_from_date_parts", "service_from")

    @property
    def formatted_service_from(self):
        """Return formatted date from string format"""
        return self.service_from or ""

    @property
    def formatted_service_to(self):
        """Return formatted date, handling 'Present' case"""
        if not self.service_to:
            return "Present"
        return self.service_to

    @classmethod
    def get_records_for_employee(cls, employee_id):
        """
        Get service records for an employee, properly ordered by date.
        Excludes records with null or empty service_from dates.
        """
        from datetime import datetime

        # Filter out null/empty service_from values in the database query
        queryset = (
            cls.objects.filter(employee__employee_id=employee_id)
            .exclude(service_from__isnull=True)
            .exclude(service_from="")
        )

        records = list(queryset)

        def parse_date(date_str):
            """Parse date string in format 'Month Day, Year'"""
            if not date_str:
                # This shouldn't happen due to the exclude filters above
                return datetime(1900, 1, 1)

            try:
                return datetime.strptime(date_str, "%B %d, %Y")
            except ValueError:
                # Handle special cases or parsing errors
                if date_str.lower() == "present":
                    # Use far future date for "Present"
                    return datetime(9999, 12, 31)
                # If parsing fails, return a fallback date
                return datetime(1901, 1, 1)

        # Sort records by service_from date (most recent first)
        return sorted(records, key=lambda record: parse_date(record.service_from))
