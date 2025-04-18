from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from django.core.management import call_command
from django.utils import timezone
import os
from django.http import FileResponse

from .models import BackupRecord
from .serializers import BackupRecordSerializer


class BackupListView(APIView):
    """
    API endpoint to list and create database backups
    """

    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        """
        Get a list of all database backups
        Optional query parameters:
          - status: Filter by status (success, failed, in_progress)
          - storage: Filter by storage location (local, google_drive, both)
          - limit: Limit the number of results
        """
        # Get query parameters
        status_filter = request.query_params.get("status")
        storage_filter = request.query_params.get("storage")
        limit = request.query_params.get("limit")

        # Start with all backups
        backups = BackupRecord.objects.all()

        # Apply filters
        if status_filter:
            backups = backups.filter(status=status_filter)

        if storage_filter:
            backups = backups.filter(storage_location=storage_filter)

        # Order by created_at descending (newest first)
        backups = backups.order_by("-created_at")

        # Apply limit if provided
        if limit and limit.isdigit():
            backups = backups[: int(limit)]

        serializer = BackupRecordSerializer(backups, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        """Create a new database backup"""
        # Add this debug code at the beginning
        from django.conf import settings

        print("Checking settings:")
        print(f"BASE_DIR = {settings.BASE_DIR}")
        try:
            print(f"BACKUP_DIR = {settings.BACKUP_DIR}")
            print(f"Directory exists: {os.path.exists(settings.BACKUP_DIR)}")
        except AttributeError:
            print("BACKUP_DIR setting is not defined!")

        # Get parameters from request
        compress = request.data.get("compress", True)
        upload_drive = request.data.get("upload_drive", False)
        monthly_folders = request.data.get("monthly_folders", True)

        # Log what we're about to do
        print(
            f"Creating backup with: compress={compress}, upload_drive={upload_drive}, monthly_folders={monthly_folders}"
        )

        # Build command arguments
        command_args = []
        if compress:
            command_args.append("--compress")
        if upload_drive:
            command_args.append("--upload-drive")
        if monthly_folders and upload_drive:
            command_args.append("--monthly-folders")

        try:
            # Add user parameter to track who initiated the backup
            command_kwargs = {
                "user": request.user.username
                if hasattr(request, "user")
                else "api_user"
            }

            print(
                f"Calling backup_mysql command with args: {command_args} and kwargs: {command_kwargs}"
            )

            # Execute backup command with kwargs
            backup_file = call_command("backup_mysql", *command_args, **command_kwargs)
            print(f"Command executed successfully, returned: {backup_file}")

            # Get the most recent backup record (created by command)
            backup = (
                BackupRecord.objects.filter(status="success")
                .order_by("-created_at")
                .first()
            )

            if backup:
                print(
                    f"Found backup record: id={backup.id}, filename={backup.filename}"
                )
                serializer = BackupRecordSerializer(backup)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print("No successful backup record found after command execution")

                # Check if there's a failed backup that might have error details
                failed_backup = (
                    BackupRecord.objects.filter(status="failed")
                    .order_by("-created_at")
                    .first()
                )

                if failed_backup and failed_backup.error_message:
                    return Response(
                        {"error": f"Backup failed: {failed_backup.error_message}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
                else:
                    return Response(
                        {"error": "Backup completed but no record was found"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
        except Exception as e:
            import traceback

            error_details = traceback.format_exc()
            print(f"Error creating backup: {str(e)}\n{error_details}")
            return Response(
                {"error": f"Failed to create backup: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class BackupDetailView(APIView):
    """
    API endpoint to get, update, or delete a specific backup
    """

    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return BackupRecord.objects.get(pk=pk)
        except BackupRecord.DoesNotExist:
            return None

    def get(self, request, pk, format=None):
        """
        Get details of a specific backup
        """
        backup = self.get_object(pk)
        if not backup:
            return Response(
                {"error": "Backup not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = BackupRecordSerializer(backup)
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        """
        Delete a backup record and optionally the backup file

        Query parameters:
          - delete_file: Boolean, whether to delete the actual backup file
        """
        backup = self.get_object(pk)
        if not backup:
            return Response(
                {"error": "Backup not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Check if we should delete the actual file
        delete_file = request.query_params.get("delete_file", "false").lower() == "true"

        # Delete the file if requested and it exists
        file_deleted = False
        if delete_file and backup.is_local_available:
            file_deleted = backup.delete_backup_file()

        # Delete the record
        backup.delete()

        return Response(
            {"message": "Backup record deleted", "file_deleted": file_deleted}
        )


class BackupDownloadView(APIView):
    """
    API endpoint to download a backup file
    """

    permission_classes = [IsAdminUser]

    def get(self, request, pk, format=None):
        """Download the actual backup file"""
        try:
            backup = BackupRecord.objects.get(pk=pk)
        except BackupRecord.DoesNotExist:
            return Response(
                {"error": "Backup not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Make sure we have a valid path
        file_path = backup.local_path

        # If it's not an absolute path, assume it's relative to BACKUP_DIR
        if not os.path.isabs(file_path):
            try:
                from django.conf import settings

                file_path = os.path.join(str(settings.BACKUP_DIR), file_path)
            except (AttributeError, ImportError):
                # Fallback if BACKUP_DIR isn't available
                file_path = os.path.join(str(settings.BASE_DIR), "backups", file_path)

        # Check if the file exists
        if not os.path.isfile(file_path):
            return Response(
                {"error": "Backup file not available for download"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Prepare file for download
        file_name = os.path.basename(file_path)

        # Determine content type
        content_type = "application/sql"
        if file_path.endswith(".gz"):
            content_type = "application/gzip"

        # Return file response
        response = FileResponse(
            open(file_path, "rb"),
            content_type=content_type,
            as_attachment=True,
            filename=file_name,
        )

        return response


class BackupExecuteView(APIView):
    """
    API endpoint to execute specific backup operations
    """

    permission_classes = [IsAdminUser]

    def post(self, request, format=None):
        """
        Execute a specific backup operation

        Request body should contain:
        {
            "operation": "create"|"cleanup"|"restore",
            "parameters": {
                // Operation-specific parameters
            }
        }
        """
        operation = request.data.get("operation")
        parameters = request.data.get("parameters", {})

        if operation == "create":
            return self._handle_create(parameters)
        elif operation == "cleanup":
            return self._handle_cleanup(parameters)
        elif operation == "restore":
            return self._handle_restore(parameters, request)
        else:
            return Response(
                {"error": f"Unsupported operation: {operation}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def _handle_create(self, parameters):
        # Similar to post method in BackupListView
        compress = parameters.get("compress", True)
        upload_drive = parameters.get("upload_drive", False)
        monthly_folders = parameters.get("monthly_folders", True)

        command_args = []
        if compress:
            command_args.append("--compress")
        if upload_drive:
            command_args.append("--upload-drive")
        if monthly_folders and upload_drive:
            command_args.append("--monthly-folders")

        try:
            backup_file = call_command("backup_mysql", *command_args)
            return Response(
                {"message": "Backup created successfully", "file": backup_file}
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to create backup: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def _handle_cleanup(self, parameters):
        # Clean up old backups based on params
        days = int(parameters.get("days", 30))
        status_filter = parameters.get("status")

        cutoff_date = timezone.now() - timezone.timedelta(days=days)

        # Start with all old backups
        query = BackupRecord.objects.filter(created_at__lt=cutoff_date)

        # Apply status filter if provided
        if status_filter:
            query = query.filter(status=status_filter)

        # Count records
        count = query.count()

        # Delete files first
        deleted_files = 0
        for backup in query:
            if backup.is_local_available and backup.delete_backup_file():
                deleted_files += 1

        # Delete records
        query.delete()

        return Response(
            {
                "message": f"Cleanup completed. Deleted {count} backup records and {deleted_files} backup files."
            }
        )

    def _handle_restore(self, parameters, request):
        """Handle database restore operation with destination options"""
        import traceback  # Add this import

        def find_mysql_executable():
            """Find MySQL executable on Windows"""
            import shutil
            import os  # Add this import here

            # Check if mysql is in PATH
            mysql_in_path = shutil.which("mysql")
            if mysql_in_path:
                return mysql_in_path

            # Common MySQL installation paths on Windows
            common_paths = [
                r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
                r"C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
                r"C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe",
                r"C:\Program Files (x86)\MySQL\MySQL Server 5.7\bin\mysql.exe",
                r"C:\xampp\mysql\bin\mysql.exe",
                r"C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe",
                r"C:\wamp\bin\mysql\mysql5.7.36\bin\mysql.exe",
                r"C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysql.exe",
            ]

            for path in common_paths:
                if os.path.isfile(path):
                    print(f"Found mysql at: {path}")
                    return path

            return None

        mysql_executable = find_mysql_executable()
        if not mysql_executable:
            return Response(
                {
                    "error": "MySQL executable not found. Please make sure MySQL is installed correctly."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        backup_id = parameters.get("backup_id")
        destination = parameters.get("destination", "same")
        new_database_name = parameters.get("new_database_name")

        # Better logging for debugging
        print(
            f"Restore request: backup_id={backup_id}, destination={destination}, new_db={new_database_name}"
        )

        if not backup_id:
            return Response(
                {"error": "backup_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            backup = BackupRecord.objects.get(pk=backup_id)
            print(f"Found backup: {backup.filename}, path={backup.local_path}")
        except BackupRecord.DoesNotExist:
            return Response(
                {"error": f"Backup with ID {backup_id} not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not backup.is_local_available:
            return Response(
                {
                    "error": f"Backup file not available for restore. Path: {backup.local_path}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Determine target database with better validation
        target_db = backup.database_name  # Default to same database

        if destination == "new" and new_database_name:
            # Validate database name
            if not all(c.isalnum() or c == "_" for c in new_database_name):
                return Response(
                    {
                        "error": "Invalid database name. Use only letters, numbers, and underscores."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            target_db = new_database_name
        elif destination != "same" and destination:
            # Validate existing database name
            if not all(c.isalnum() or c == "_" for c in destination):
                return Response(
                    {
                        "error": "Invalid database name. Use only letters, numbers, and underscores."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            target_db = destination

        print(f"Target database: {target_db}")

        # Build the restore command
        try:
            from django.conf import settings
            import subprocess
            import os
            import configparser
            import tempfile

            # Get database configuration
            config_file = os.path.join(settings.BASE_DIR, "configurations.cnf")
            if not os.path.exists(config_file):
                return Response(
                    {"error": f"Configuration file not found: {config_file}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            # Parse the configuration file
            config = configparser.ConfigParser()
            config.read(config_file)

            if "client" not in config:
                return Response(
                    {"error": "Invalid configuration file - missing [client] section"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            # Get database connection details
            db_host = config["client"].get("host", "localhost")
            db_port = config["client"].get("port", "3306")
            db_user = config["client"].get("user", "")
            db_password = config["client"].get("password", "")

            print(f"DB connection: host={db_host}, port={db_port}, user={db_user}")

            # Check if using compressed backup
            input_file = backup.local_path

            # If it's not an absolute path, resolve it correctly relative to BACKUP_DIR
            if not os.path.isabs(input_file):
                from django.conf import settings

                input_file = os.path.join(str(settings.BACKUP_DIR), input_file)

            # Debug the path resolution
            print(f"Original path: {backup.local_path}")
            print(f"Resolved path: {input_file}")
            print(f"File exists: {os.path.exists(input_file)}")
            print(f"BACKUP_DIR: {settings.BACKUP_DIR}")

            # Check if the directory exists
            backup_dir = settings.BACKUP_DIR
            if os.path.exists(backup_dir):
                print(f"Files in backup directory: {os.listdir(backup_dir)}")
            else:
                print(f"Backup directory does not exist: {backup_dir}")

            # Verify file exists and is readable
            if not os.path.isfile(input_file):
                # If the file doesn't exist at the resolved path, try the get_full_path method
                if hasattr(backup, "get_full_path"):
                    full_path = backup.get_full_path
                    print(f"Trying alternate path resolution: {full_path}")
                    if full_path and os.path.isfile(full_path):
                        input_file = full_path
                        print(f"Using alternate path: {input_file}")
                    else:
                        return Response(
                            {
                                "error": f"Backup file does not exist at path: {input_file}"
                            },
                            status=status.HTTP_404_NOT_FOUND,
                        )
                else:
                    return Response(
                        {"error": f"Backup file does not exist at path: {input_file}"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

            if not os.access(input_file, os.R_OK):
                return Response(
                    {"error": f"Backup file is not readable: {input_file}"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Add this code right after verifying the file exists
            # Determine if the file is compressed
            is_compressed = (
                backup.is_compressed if hasattr(backup, "is_compressed") else False
            )

            # If is_compressed is not set in the model, try to detect from filename
            if not hasattr(backup, "is_compressed") or backup.is_compressed is None:
                is_compressed = input_file.lower().endswith(
                    ".gz"
                ) or input_file.lower().endswith(".gzip")

            print(f"Backup is compressed: {is_compressed}")

            # Create a temporary file for credentials to avoid shell injection
            with tempfile.NamedTemporaryFile(
                mode="w+", delete=False, suffix=".cnf"
            ) as tmp:
                tmp.write(
                    f"[client]\nhost={db_host}\nport={db_port}\nuser={db_user}\npassword={db_password}\n"
                )
                tmp_config_file = tmp.name

            try:
                # For new databases, create the database first
                if destination == "new" and new_database_name:
                    create_db_cmd = [
                        mysql_executable,  # Use full path instead of "mysql"
                        f"--defaults-file={tmp_config_file}",
                        "-e",
                        f"CREATE DATABASE IF NOT EXISTS `{target_db}`;",
                    ]
                    print(f"Creating database with command: {' '.join(create_db_cmd)}")

                    # Use list format for better security
                    process = subprocess.run(
                        create_db_cmd, capture_output=True, text=True, check=True
                    )
                    print(f"Create DB result: {process.stdout}")

                # Replace the compressed file restore section
                if is_compressed:
                    # Use Python's gzip module instead of relying on gunzip command
                    import gzip
                    import tempfile

                    # Decompress the file to a temporary location
                    temp_sql_file = None
                    try:
                        # Create a temporary file for the decompressed SQL
                        temp_sql_file = tempfile.NamedTemporaryFile(
                            delete=False, suffix=".sql"
                        )
                        temp_sql_file.close()  # Close it so we can reopen with gzip

                        # Decompress the backup file
                        print(f"Decompressing backup file to {temp_sql_file.name}")
                        with gzip.open(input_file, "rb") as f_in:
                            with open(temp_sql_file.name, "wb") as f_out:
                                f_out.write(f_in.read())

                        # Use the decompressed file for restore
                        print(
                            f"Using decompressed file for restore: {temp_sql_file.name}"
                        )

                        # On Windows, avoid shell=True and redirection - use binary file read instead
                        with open(temp_sql_file.name, "rb") as sql_input:
                            mysql_cmd = [
                                mysql_executable,
                                f"--defaults-file={tmp_config_file}",
                                target_db,
                            ]

                            print(
                                f"Restoring compressed backup with command: {' '.join(mysql_cmd)}"
                            )

                            # Add before executing the restore command
                            print(f"MySQL command: {' '.join(mysql_cmd)}")
                            print(f"Checking configuration file: {tmp_config_file}")
                            with open(tmp_config_file, "r") as f:
                                config_content = f.read()
                                # Print masked password
                                masked_config = config_content.replace(
                                    db_password, "****" if db_password else ""
                                )
                                print(f"Config file content:\n{masked_config}")

                            # Test for basic MySQL connectivity before restore
                            try:
                                test_cmd = [
                                    mysql_executable,
                                    f"--defaults-file={tmp_config_file}",
                                    "-e",
                                    "SELECT 'Test connection successful' AS message",
                                ]

                                test_result = subprocess.run(
                                    test_cmd,
                                    capture_output=True,
                                    text=True,
                                    check=False,  # Don't raise exception, just capture output
                                )

                                if test_result.returncode == 0:
                                    print("MySQL connection test: SUCCESS")
                                else:
                                    print(
                                        f"MySQL connection test FAILED: {test_result.stderr}"
                                    )
                            except Exception as e:
                                print(f"MySQL connection test error: {str(e)}")

                            # Execute the restore by piping file content to mysql
                            process = subprocess.run(
                                mysql_cmd,
                                input=sql_input.read(),  # Pass file content directly
                                capture_output=True,
                                check=True,
                            )

                            print("Restore completed successfully")

                    finally:
                        # Clean up the temporary SQL file
                        if temp_sql_file and os.path.exists(temp_sql_file.name):
                            try:
                                os.remove(temp_sql_file.name)
                                print(
                                    f"Removed temporary SQL file: {temp_sql_file.name}"
                                )
                            except Exception as e:
                                print(f"Warning: Could not remove temporary file: {e}")
                else:
                    # For non-compressed backups (your existing code)
                    with open(input_file, "rb") as sql_file:
                        mysql_cmd = [
                            mysql_executable,  # Use full path instead of "mysql"
                            f"--defaults-file={tmp_config_file}",
                            target_db,
                        ]

                        print(f"Restoring uncompressed backup: {' '.join(mysql_cmd)}")

                        # Add before executing the restore command
                        print(f"MySQL command: {' '.join(mysql_cmd)}")
                        print(f"Checking configuration file: {tmp_config_file}")
                        with open(tmp_config_file, "r") as f:
                            config_content = f.read()
                            # Print masked password
                            masked_config = config_content.replace(
                                db_password, "****" if db_password else ""
                            )
                            print(f"Config file content:\n{masked_config}")

                        # Test for basic MySQL connectivity before restore
                        try:
                            test_cmd = [
                                mysql_executable,
                                f"--defaults-file={tmp_config_file}",
                                "-e",
                                "SELECT 'Test connection successful' AS message",
                            ]

                            test_result = subprocess.run(
                                test_cmd,
                                capture_output=True,
                                text=True,
                                check=False,  # Don't raise exception, just capture output
                            )

                            if test_result.returncode == 0:
                                print("MySQL connection test: SUCCESS")
                            else:
                                print(
                                    f"MySQL connection test FAILED: {test_result.stderr}"
                                )
                        except Exception as e:
                            print(f"MySQL connection test error: {str(e)}")

                        process = subprocess.run(
                            mysql_cmd,
                            input=sql_file.read(),
                            capture_output=True,
                            check=True,
                        )

                        print("Restore completed successfully")

                # Log the restore operation
                restore_record = BackupRecord(
                    filename=f"Restore from {os.path.basename(backup.local_path)}",
                    status="success",
                    database_name=target_db,
                    execution_time_seconds=0,
                    command_executed=str(mysql_cmd),
                    storage_location="none",
                    user_who_ran=request.user.username,
                )
                restore_record.save()

            finally:
                # Clean up temporary file
                os.remove(tmp_config_file)

            return Response(
                {
                    "message": f"Database restored successfully to '{target_db}'",
                    "source_backup_id": backup_id,
                    "target_database": target_db,
                }
            )

        except subprocess.CalledProcessError as e:
            # Check if stderr is bytes (needs decoding) or already a string
            if hasattr(e, "stderr"):
                if isinstance(e.stderr, bytes):
                    error_message = e.stderr.decode(errors="replace")
                else:
                    error_message = str(e.stderr)
            else:
                error_message = str(e)

            print(f"Restore failed: {error_message}")
            return Response(
                {"error": f"Failed to restore database: {error_message}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            print(f"Unexpected error during restore: {traceback.format_exc()}")
            return Response(
                {"error": f"Failed to restore database: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
