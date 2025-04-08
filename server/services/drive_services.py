from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload, MediaIoBaseDownload
from django.conf import settings
from io import BytesIO


def build_drive_service():
    # Get credentials from settings
    credentials = settings.GOOGLE_DRIVE_CREDENTIALS
    if credentials is None:
        raise Exception("Google Drive credentials not found!")

    # Build the Drive service
    service = build("drive", "v3", credentials=credentials)
    return service


def create_folder(folder_name, parent_folder_id="1bXWiVgFCnq7J93SjKjkeeGBX1uOFN30G"):
    """Create a folder in Google Drive."""
    service = build_drive_service()

    FOLDER_METADATA = {
        "name": folder_name,
        "mimeType": "application/vnd.google-apps.folder",
        "parents": [parent_folder_id],
    }

    folder = service.files().create(body=FOLDER_METADATA, fields="id").execute()
    set_file_permissions(folder.get("id"))
    return folder.get("id")


def upload_to_drive(file_io, file_name, folder_id):
    """Uploads a file to Google Drive."""
    service = build_drive_service()
    # Set file metadata
    file_metadata = {
        "name": file_name,
        "parents": [folder_id],
    }

    # Upload the file using MediaIoBaseUpload
    media = MediaIoBaseUpload(
        file_io, mimetype="application/octet-stream", resumable=True
    )
    file = (
        service.files()
        .create(body=file_metadata, media_body=media, fields="id")
        .execute()
    )

    set_file_permissions(file.get("id"))

    return {"name": file_name, "id": file.get("id")}


def update_file(file_id, file_io=None, new_name=None):
    """Update a file in Google Drive by deleting and recreating it."""
    service = build_drive_service()

    # Get the original file's parent folder
    file_data = service.files().get(fileId=file_id, fields="parents").execute()
    parent_folder_id = (
        file_data.get("parents", [])[0] if file_data.get("parents") else None
    )

    # Delete the existing file
    delete_file(file_id)

    # If no new content or name provided, return None
    if not file_io and not new_name:
        return None

    # Set up file metadata for new file
    file_metadata = {
        "name": new_name,
        "parents": [parent_folder_id] if parent_folder_id else None,
    }

    # Upload the new file
    media = None
    if file_io:
        media = MediaIoBaseUpload(
            file_io, mimetype="application/octet-stream", resumable=True
        )

    file = (
        service.files()
        .create(body=file_metadata, media_body=media, fields="id, name")
        .execute()
    )

    # Set permissions for the new file
    set_file_permissions(file.get("id"))

    return {"name": file.get("name"), "id": file.get("id")}


def set_file_permissions(file_id):
    """Set permissions for a file in Google Drive."""
    service = build_drive_service()
    permission = {"type": "anyone", "role": "reader"}
    service.permissions().create(fileId=file_id, body=permission).execute()


def get_file_to_folder(folder_id):
    """Retrieve files from a specific folder in Google Drive."""
    service = build_drive_service()
    query = f"'{folder_id}' in parents and trashed=false"
    results = service.files().list(q=query, fields="files(id, name)").execute()
    files = results.get("files", [])
    return files


def delete_file(file_id):
    """Delete a file from Google Drive."""
    service = build_drive_service()
    service.files().delete(fileId=file_id).execute()


def download_file(file_id):
    """
    Download a file from Google Drive by its file ID.

    Args:
        file_id (str): The Google Drive file ID

    Returns:
        bytes: The file content as bytes, or None if download fails
    """
    try:
        service = build_drive_service()

        # Get file metadata to confirm it exists
        file = service.files().get(fileId=file_id).execute()
        if not file:
            print(f"File with ID {file_id} not found")
            return None

        # Get download URL
        request = service.files().get_media(fileId=file_id)

        # Create a BytesIO stream
        file_content = BytesIO()

        # Use the Google API client to download the file
        downloader = MediaIoBaseDownload(file_content, request)

        done = False
        while not done:
            status, done = downloader.next_chunk()

        # Return the file content as bytes
        return file_content.getvalue()

    except Exception as e:
        print(f"Error downloading file from Google Drive: {str(e)}")
        return None
