# server/management/commands/backup_mysql.py
import os
import subprocess
import shutil
import configparser
import time
import gzip
from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone
from backup.models import BackupRecord


class Command(BaseCommand):
    help = "Backup MySQL database using settings from configurations.cnf"

    def add_arguments(self, parser):
        parser.add_argument(
            "--database",
            type=str,
            help="Database name to backup (defaults to the one in settings)",
        )
        parser.add_argument(
            "--compress",
            action="store_true",
            help="Compress the backup file using gzip",
        )
        parser.add_argument(
            "--upload-drive",
            action="store_true",
            help="Upload the backup to Google Drive",
        )
        parser.add_argument(
            "--monthly-folders",
            action="store_true",
            help="Organize Google Drive backups into monthly folders",
        )
        parser.add_argument(
            "--user",
            type=str,
            help="Username of the user who initiated the backup",
            default="system",
        )

    def handle(self, *args, **options):
        start_time = time.time()

        # Find mysqldump executable
        mysqldump_executable = self._find_mysqldump_executable()
        if not mysqldump_executable:
            self.stderr.write(
                self.style.WARNING(
                    "mysqldump executable not found. Falling back to Python backup method..."
                )
            )

        self.stdout.write(f"Using mysqldump from: {mysqldump_executable}")

        # Get database from options or settings
        db_name = options.get("database")
        if not db_name:
            # Get the database name from DATABASES settings
            try:
                db_name = settings.DATABASES["default"].get("NAME")
                if not db_name:
                    # Try to get from OPTIONS if NAME isn't directly specified
                    db_config = settings.DATABASES["default"].get("OPTIONS", {})
                    if "read_default_file" in db_config:
                        # Parse the configuration file to extract the database name
                        config = configparser.ConfigParser()
                        config.read(db_config["read_default_file"])
                        if "client" in config and "database" in config["client"]:
                            db_name = config["client"]["database"]
            except (KeyError, AttributeError) as e:
                self.stderr.write(self.style.ERROR(f"Error getting database name: {e}"))

        if not db_name:
            raise Exception(
                "No database name specified. Please provide a database name."
            )

        self.stdout.write(f"Using database: {db_name}")

        # Create backup directory if it doesn't exist
        try:
            backup_dir = settings.BACKUP_DIR
            os.makedirs(backup_dir, exist_ok=True)
        except AttributeError:
            backup_dir = os.path.join(settings.BASE_DIR, "backups")
            os.makedirs(backup_dir, exist_ok=True)
            self.stdout.write(
                self.style.WARNING("BACKUP_DIR setting not found, using default path")
            )

        self.stdout.write(f"Using backup directory: {backup_dir}")

        # Generate timestamp and filename
        timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{db_name}-{timestamp}.sql"
        if options["compress"]:
            filename += ".gz"

        # Create the full path for file operations
        file_path = os.path.join(str(backup_dir), filename)

        # Record for tracking the backup
        backup_record = BackupRecord(
            filename=filename,
            database_name=db_name,
            status="in_progress",
            is_compressed=bool(options["compress"]),
            storage_location="local",
            local_path=filename,  # Store just the filename
            user_who_ran=options.get("user", "system"),
        )
        backup_record.save()

        try:
            # Get MySQL configuration
            config_file = os.path.join(settings.BASE_DIR, "configurations.cnf")
            if not os.path.exists(config_file):
                raise Exception(f"MySQL configuration file not found: {config_file}")

            # Create a more secure way to execute mysqldump
            try:
                # Parse the config file to get credentials
                config = configparser.ConfigParser()
                config.read(config_file)

                if "client" not in config:
                    raise Exception(
                        "Missing [client] section in MySQL configuration file"
                    )

                db_host = config["client"].get("host", "localhost")
                db_port = config["client"].get("port", "3306")
                db_user = config["client"].get("user", "")
                db_password = config["client"].get("password", "")

                # Build the command with explicit parameters instead of defaults file
                mysqldump_cmd = [
                    mysqldump_executable,
                    f"-h{db_host}",
                    f"-P{db_port}",
                    f"-u{db_user}",
                ]

                # Add password if present
                if db_password:
                    mysqldump_cmd.append(f"-p{db_password}")

                # Explicitly add database name
                mysqldump_cmd.append(db_name)

                # Sanitized command for logging (hide password)
                log_cmd = [
                    cmd if not cmd.startswith("-p") else "-p******"
                    for cmd in mysqldump_cmd
                ]
                self.stdout.write(f"Running mysqldump command: {' '.join(log_cmd)}")

                if options["compress"]:
                    # For compressed backup
                    with open(file_path, "wb") as output_file:
                        dump_process = subprocess.Popen(
                            mysqldump_cmd,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                        )

                        # Use Python's gzip to compress the output
                        with gzip.open(output_file, "wb") as gzipped:
                            # Read and compress in chunks to handle large databases
                            while True:
                                chunk = dump_process.stdout.read(4096)
                                if not chunk:
                                    break
                                gzipped.write(chunk)

                        # Check for errors
                        stderr = dump_process.stderr.read()
                        returncode = dump_process.wait()

                        if returncode != 0:
                            error_msg = stderr.decode("utf-8", errors="replace")
                            raise Exception(
                                f"mysqldump failed with code {returncode}: {error_msg}"
                            )
                else:
                    # For uncompressed backup
                    with open(file_path, "wb") as output_file:
                        process = subprocess.run(
                            mysqldump_cmd,
                            stdout=output_file,
                            stderr=subprocess.PIPE,
                            check=True,
                        )

                # Update record with success status
                backup_record.status = "success"
                backup_record.command_executed = " ".join(
                    log_cmd
                )  # Don't store password in DB
                backup_record.execution_time_seconds = time.time() - start_time

                # Get file size
                if os.path.exists(file_path):
                    backup_record.size_bytes = os.path.getsize(file_path)

                # Handle Google Drive upload if requested
                if options["upload_drive"]:
                    # Add your Google Drive upload code here
                    pass

                backup_record.save()

                self.stdout.write(
                    self.style.SUCCESS(f"Backup completed successfully: {filename}")
                )
                self.stdout.write(f"Size: {os.path.getsize(file_path)} bytes")
                self.stdout.write(
                    f"Time taken: {backup_record.execution_time_seconds:.2f} seconds"
                )

                return filename

            except Exception as e:
                self.stderr.write(
                    self.style.ERROR(f"Error executing mysqldump: {str(e)}")
                )
                raise

        except Exception as e:
            self.stderr.write(
                self.style.WARNING(
                    f"mysqldump method failed ({str(e)}), trying Python backup method..."
                )
            )

            config = configparser.ConfigParser()
            config.read(config_file)
            db_config = config["client"] if "client" in config else {}

            if self._backup_database_python(
                db_config, db_name, file_path, options["compress"]
            ):
                # Python backup succeeded, update the record
                backup_record.status = "success"
                backup_record.command_executed = "python_backup_method"
                backup_record.execution_time_seconds = time.time() - start_time

                # Get file size
                if os.path.exists(file_path):
                    backup_record.size_bytes = os.path.getsize(file_path)

                backup_record.save()

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Backup completed with Python method: {filename}"
                    )
                )
                return filename
            else:
                # Both methods failed
                backup_record.status = "failed"
                backup_record.error_message = str(e)
                backup_record.execution_time_seconds = time.time() - start_time
                backup_record.save()

                self.stderr.write(self.style.ERROR(f"Backup failed: {str(e)}"))
                raise

    def _find_mysqldump_executable(self):
        """Find the mysqldump executable on the system"""
        # First check if it's in PATH
        mysqldump_in_path = shutil.which("mysqldump")
        if mysqldump_in_path:
            return mysqldump_in_path

        # Common MySQL installation paths on Windows
        common_paths = [
            r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
            r"C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqldump.exe",
            r"C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
            r"C:\Program Files (x86)\MySQL\MySQL Server 5.7\bin\mysqldump.exe",
            r"C:\xampp\mysql\bin\mysqldump.exe",
            r"C:\wamp64\bin\mysql\mysql8.0.31\bin\mysqldump.exe",
            r"C:\wamp\bin\mysql\mysql5.7.36\bin\mysqldump.exe",
        ]

        for path in common_paths:
            if os.path.exists(path):
                return path

        return None

    def _backup_database_python(self, db_config, db_name, output_path, compress=False):
        """Backup database using pure Python (fallback when mysqldump isn't available)"""
        try:
            import mysql.connector

            self.stdout.write("Falling back to pure Python backup method...")

            # Connect to database
            conn = mysql.connector.connect(
                host=db_config.get("host", "localhost"),
                port=int(db_config.get("port", 3306)),
                user=db_config.get("user", ""),
                password=db_config.get("password", ""),
                database=db_name,
            )

            cursor = conn.cursor()

            # Open the output file (compressed or plain)
            if compress:
                outfile = gzip.open(output_path, "wt", encoding="utf-8")
            else:
                outfile = open(output_path, "w", encoding="utf-8")

            # Write header
            outfile.write(f"-- MySQL database dump of {db_name}\n")
            outfile.write(f"-- Generated by Django on {timezone.now()}\n")
            outfile.write("-- Using Python backup method\n\n")
            outfile.write("SET FOREIGN_KEY_CHECKS=0;\n\n")

            # Get all tables
            cursor.execute("SHOW TABLES")
            tables = [table[0] for table in cursor.fetchall()]

            # For each table, get structure and data
            for table in tables:
                self.stdout.write(f"  Backing up table: {table}")

                # Get create table statement
                cursor.execute(f"SHOW CREATE TABLE `{table}`")
                create_stmt = cursor.fetchone()[1]
                outfile.write(f"{create_stmt};\n\n")

                # Get data
                cursor.execute(f"SELECT * FROM `{table}`")
                rows = cursor.fetchall()

                if rows:
                    # Get column names for INSERT statements
                    cols = [col[0] for col in cursor.description]

                    # Write data
                    for row in rows:
                        values = []
                        for val in row:
                            if val is None:
                                values.append("NULL")
                            elif isinstance(val, (int, float)):
                                values.append(str(val))
                            elif isinstance(val, bytes):
                                # Handle binary data with hex notation
                                values.append(f"0x{val.hex()}")
                            else:
                                # Escape strings
                                val_str = (
                                    str(val).replace("'", "''").replace("\\", "\\\\")
                                )
                                values.append(f"'{val_str}'")

                        outfile.write(
                            f"INSERT INTO `{table}` (`{'`, `'.join(cols)}`) VALUES ({', '.join(values)});\n"
                        )

                    outfile.write("\n")

            # Write footer
            outfile.write("SET FOREIGN_KEY_CHECKS=1;\n")

            # Close everything
            outfile.close()
            cursor.close()
            conn.close()

            self.stdout.write(
                self.style.SUCCESS(
                    f"Pure Python backup completed successfully for {db_name}"
                )
            )
            return True

        except ImportError:
            self.stderr.write(
                self.style.ERROR(
                    "mysql-connector-python not installed. Cannot perform Python backup."
                )
            )
            self.stderr.write("Install with: pip install mysql-connector-python")
            return False
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Python backup error: {str(e)}"))
            return False
