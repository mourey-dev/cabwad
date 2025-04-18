from django.db import models
from django.utils import timezone
import os


class BackupRecord(models.Model):
    """
    Model to track database backups with metadata
    """

    BACKUP_STATUS_CHOICES = [
        ("success", "Success"),
        ("failed", "Failed"),
        ("in_progress", "In Progress"),
    ]

    STORAGE_LOCATION_CHOICES = [
        ("local", "Local Storage"),
        ("google_drive", "Google Drive"),
        ("both", "Local and Google Drive"),
    ]

    # Basic backup information
    filename = models.CharField(max_length=255, help_text="Name of the backup file")
    created_at = models.DateTimeField(
        default=timezone.now, help_text="When the backup was created"
    )
    size_bytes = models.BigIntegerField(
        null=True, blank=True, help_text="Size of the backup file in bytes"
    )
    is_compressed = models.BooleanField(
        default=False, help_text="Whether the backup is compressed (gzip)"
    )

    # Backup status
    status = models.CharField(
        max_length=20,
        choices=BACKUP_STATUS_CHOICES,
        default="in_progress",
        help_text="Current status of the backup",
    )

    # Storage information
    storage_location = models.CharField(
        max_length=20,
        choices=STORAGE_LOCATION_CHOICES,
        default="local",
        help_text="Where the backup is stored",
    )
    local_path = models.CharField(
        max_length=512,
        null=True,
        blank=True,
        help_text="Full path to backup file on local storage",
    )
    google_drive_id = models.CharField(
        max_length=100, null=True, blank=True, help_text="Google Drive file ID"
    )

    # Metadata for tracking and debugging
    execution_time_seconds = models.FloatField(
        null=True, blank=True, help_text="How long the backup process took"
    )
    error_message = models.TextField(
        null=True, blank=True, help_text="Error message if backup failed"
    )
    command_executed = models.TextField(
        null=True,
        blank=True,
        help_text="Command that was executed to create the backup",
    )
    database_name = models.CharField(
        max_length=100, help_text="Name of the database that was backed up"
    )
    user_who_ran = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Username who triggered the backup",
    )
    retention_days = models.IntegerField(
        default=30, help_text="Number of days this backup should be kept"
    )

    # Auto-delete information
    scheduled_deletion = models.DateTimeField(
        null=True, blank=True, help_text="When this backup is scheduled for deletion"
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Database Backup"
        verbose_name_plural = "Database Backups"
        indexes = [
            models.Index(fields=["created_at"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"{self.database_name} - {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"

    def save(self, *args, **kwargs):
        # If saving a new record and local_path is an absolute path
        if self.local_path and os.path.isabs(self.local_path):
            # Store just the filename, not the full path
            self.local_path = os.path.basename(self.local_path)

        # Calculate the scheduled deletion date
        if not self.scheduled_deletion and self.retention_days:
            self.scheduled_deletion = self.created_at + timezone.timedelta(
                days=self.retention_days
            )

        # Calculate file size if path is available
        if self.local_path and os.path.exists(self.local_path) and not self.size_bytes:
            self.size_bytes = os.path.getsize(self.local_path)

        super().save(*args, **kwargs)

    @property
    def get_full_path(self):
        """Get the full path to the backup file"""
        from django.conf import settings
        import os

        if not self.local_path:
            return None

        # If local_path is already an absolute path, return it
        if os.path.isabs(self.local_path):
            return self.local_path

        # Join with backup directory
        backup_dir = str(settings.BACKUP_DIR)
        full_path = os.path.join(backup_dir, self.local_path)

        # Debug info
        print(f"get_full_path: {self.local_path} -> {full_path}")

        return full_path

    @property
    def is_local_available(self):
        """Check if the backup file exists locally"""
        import os

        path = self.get_full_path
        return path is not None and os.path.isfile(path)

    @property
    def is_google_drive_available(self):
        """Check if the backup exists on Google Drive (based on ID)"""
        return bool(self.google_drive_id)

    @property
    def formatted_size(self):
        """Return a human-readable file size"""
        if not self.size_bytes:
            return "Unknown size"

        # Convert bytes to appropriate unit
        for unit in ["B", "KB", "MB", "GB"]:
            if self.size_bytes < 1024.0:
                return f"{self.size_bytes:.2f} {unit}"
            self.size_bytes /= 1024.0
        return f"{self.size_bytes:.2f} TB"

    @property
    def days_until_deletion(self):
        """Return the number of days until this backup is deleted"""
        if not self.scheduled_deletion:
            return None

        delta = self.scheduled_deletion - timezone.now()
        return max(0, delta.days)

    def delete_backup_file(self):
        """Delete the actual backup file"""
        import os

        path = self.get_full_path
        if path and os.path.isfile(path):
            try:
                os.remove(path)
                return True
            except Exception:
                return False
        return False
