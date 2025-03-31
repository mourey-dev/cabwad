import os

from io import BytesIO

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject

from utils.dict_handler import destructure_dict, update_dict_key


class PDSBuilder:
    def __init__(self, data: dict):
        self.data = data
        self.pds = None
        self.base_path = os.path.dirname(os.path.abspath(__file__))
        self.input_path = os.path.join(
            self.base_path, "../../static/pdfs/PDS_CS_Form_No_212_Revised2017.pdf"
        )

    def update_pds_data(self):
        update_dict_key(self.data["learning_development"])
        update_dict_key(self.data["civil_service_eligibility"])
        update_dict_key(self.data["work_experience"])
        update_dict_key(self.data["voluntary_work"])
        update_dict_key(self.data["other_information"]["skills"])

        return self

    def destruct_pds_data(self):
        self.data["civil_service_eligibility"] = destructure_dict(
            self.data["civil_service_eligibility"]
        )
        self.data["work_experience"] = destructure_dict(self.data["work_experience"])
        self.data["voluntary_work"] = destructure_dict(self.data["voluntary_work"])
        self.data["learning_development"] = destructure_dict(
            self.data["learning_development"]
        )
        self.data["other_information"].update(
            destructure_dict(self.data["other_information"]["skills"])
        )
        self.data["other_information"].pop("skills")

        return self

    def update(self):
        new_data = {}
        new_data.update(self.data["personal_information"])
        new_data.update(self.data["family_background"])
        new_data.update(self.data["educational_background"])
        new_data.update(self.data["civil_service_eligibility"])
        new_data.update(self.data["work_experience"])
        new_data.update(self.data["voluntary_work"])
        new_data.update(self.data["learning_development"])
        new_data.update(self.data["other_information"])

        self.data = new_data

        return self

    def create_pds(self):
        reader = PdfReader(self.input_path)
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
                    value = self.data.get(field_name, "")
                    writer.update_page_form_field_values(
                        page,
                        {
                            field_name: f"/{value.lower() if not isinstance(value, bool) else ''}"
                        },
                    )
                else:
                    value = self.data.get(field_name, "")
                    writer.update_page_form_field_values(
                        page, {field_name: value if value and len(value) > 0 else "N/A"}
                    )

        # Save the modified PDF to a BytesIO object
        output_pdf = BytesIO()
        writer.write(output_pdf)
        output_pdf.seek(0)  # Move the cursor to the beginning of the BytesIO object

        self.pds = output_pdf

        return self

    def build(self):
        return self.pds
