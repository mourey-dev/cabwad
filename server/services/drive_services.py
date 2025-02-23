from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from django.conf import settings
from googleapiclient.errors import HttpError


def build_drive_service():
    # Get credentials from settings
    credentials = settings.GOOGLE_DRIVE_CREDENTIALS
    if credentials is None:
        raise Exception("Google Drive credentials not found!")

    # Build the Drive service
    service = build("drive", "v3", credentials=credentials)
    return service


def create_folder(folder_name, parent_folder_id):
    """Create a folder in Google Drive."""
    service = build_drive_service()

    FOLDER_METADATA = {
        "name": folder_name,
        "mimeType": "application/vnd.google-apps.folder",
        "parents": [parent_folder_id],
    }

    folder = service.files().create(body=FOLDER_METADATA, fields="id").execute()
    return folder.get("id")


def upload_to_drive(file_path, file_name, folder_id):
    """Uploads a file to Google Drive."""
    service = build_drive_service()
    # Set file metadata
    file_metadata = {
        "name": file_name,
        "parents": [folder_id],
    }

    # Upload the file
    media = MediaFileUpload(file_path, resumable=True)
    service
    file = (
        service.files()
        .create(body=file_metadata, media_body=media, fields="id")
        .execute()
    )

    set_file_permissions(file.get("id"))

    return {"name": file_name, "id": file.get("id")}


def set_file_permissions(file_id):
    """Set permissions for a file in Google Drive."""
    service = build_drive_service()
    permission = {"type": "anyone", "role": "reader"}
    service.permissions().create(fileId=file_id, body=permission).execute()
