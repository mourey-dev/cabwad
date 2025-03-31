import base64

from io import BytesIO

from rest_framework.response import Response
from rest_framework import status


def file64_to_file(payload):
    file_content = payload.get("fileContent")
    file_type = payload.get("fileType")
    file_name = payload.get("fileName")

    if not file_content or not file_type or not file_name:
        return Response({"detail": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Decode the base64 content
        file_data = base64.b64decode(file_content.split(",")[1])
        file_io = BytesIO(file_data)
        return file_io
    except Exception as e:
        return Response(
            {"detail": f"Error decoding file: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )
