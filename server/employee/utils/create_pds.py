import os
from io import BytesIO
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject
from services.drive_services import create_folder, upload_to_drive

print(__file__)
base_path = os.path.dirname(os.path.abspath(__file__))
input_path = os.path.join(
    base_path, "../../static/pdfs/PDS_CS_Form_No_212_Revised2017.pdf"
)


def create_pds(data):
    data = dict(data)  # Ensure data is a dictionary
    reader = PdfReader(input_path)
    writer = PdfWriter()

    # Copy pages from reader to writer
    for page in reader.pages:
        writer.add_page(page)

    # Copy the /AcroForm dictionary from reader to writer
    if "/AcroForm" in reader.trailer["/Root"]:
        writer._root_object.update(
            {NameObject("/AcroForm"): reader.trailer["/Root"]["/AcroForm"]}
        )

    fields = reader.get_fields()

    for page_num, page in enumerate(writer.pages):
        for field_name, field in fields.items():
            field_type = field.get("/FT")
            if field_type == "/Btn":  # Checkbox field
                value = data.get(field_name, "")
                writer.update_page_form_field_values(
                    page,
                    {
                        field_name: f"/{value.lower() if not isinstance(value, bool) else ''}"
                    },
                )
            else:
                value = data.get(field_name, "")
                writer.update_page_form_field_values(
                    page, {field_name: value if value and len(value) > 0 else "N/A"}
                )

    # Save the modified PDF to a BytesIO object
    output_pdf = BytesIO()
    writer.write(output_pdf)
    output_pdf.seek(0)  # Move the cursor to the beginning of the BytesIO object

    return output_pdf

    parent_folder = "1bXWiVgFCnq7J93SjKjkeeGBX1uOFN30G"
    folder_name = f"{data.get('p_surname')}, {data.get('p_first_name')}"
    file_name = f"{folder_name}_PDS"
    folder_id = create_folder(folder_name, parent_folder)

    file = upload_to_drive(
        output_pdf,
        file_name,
        folder_id,
    )

    return {"folder_id": folder_id, "file": file}
