from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject

path = "c:/Projects/cabwad/server/static/pdfs/PDS_CS_Form_No_212_Revised2017.pdf"
output_path = (
    "c:/Projects/cabwad/server/static/pdfs/PDS_CS_Form_No_212_Revised2017_filled.pdf"
)


def create_pds(data):
    data = dict(data)  # Ensure data is a dictionary
    reader = PdfReader(path)
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
                writer.update_page_form_field_values(page, {field_name: f"/{value}"})
                # print(f"Checkbox Field: {field_name}, Value: {value}")
            else:
                value = data.get(field_name, "")
                writer.update_page_form_field_values(page, {field_name: value})
                # print(f"Field: {field_name}, Value: {value}")

    # Save the modified PDF to a new file
    with open(output_path, "wb") as output_pdf:
        writer.write(output_pdf)
