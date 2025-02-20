from django.core.management.base import BaseCommand
from pypdf import PdfReader

path = "c:/Projects/cabwad/server/static/pdfs/PDS_CS_Form_No_212_Revised2017.pdf"


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        reader = PdfReader(path)
        fields = reader.get_fields()

        for field_name, field in fields.items():
            field_type = field.get("/FT")
            if field_type == "/Btn":  # Checkbox field
                value = field.get("/V", "Off")
                print(f"Checkbox Field: {field_name}, Value: {value}")
            else:
                value = field.get("/V", "")
                print(f"Field: {field_name}, Value: {value}")
