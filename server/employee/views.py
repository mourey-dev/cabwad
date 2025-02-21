from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .utilities.update_dict_key import update_dict_key
from .utilities.create_pds import create_pds
from .utilities.destructure_dict import destructure_dict


class EmployeeView(APIView):
    def post(self, request):
        data = request.data
        update_dict_key(data["learning_development"])
        update_dict_key(data["civil_service_eligibility"])
        update_dict_key(data["work_experience"])
        update_dict_key(data["voluntary_work"])
        update_dict_key(data["other_information"]["skills"])

        data["civil_service_eligibility"] = destructure_dict(
            data["civil_service_eligibility"]
        )
        data["work_experience"] = destructure_dict(data["work_experience"])
        data["voluntary_work"] = destructure_dict(data["voluntary_work"])
        data["learning_development"] = destructure_dict(data["learning_development"])
        data["other_information"].update(
            destructure_dict(data["other_information"]["skills"])
        )

        # Remove the skills key from other_information
        data["other_information"].pop("skills")

        combined_data = {}
        combined_data.update(data["personal_information"])
        combined_data.update(data["family_background"])
        combined_data.update(data["educational_background"])
        combined_data.update(data["civil_service_eligibility"])
        combined_data.update(data["work_experience"])
        combined_data.update(data["voluntary_work"])
        combined_data.update(data["learning_development"])
        combined_data.update(data["other_information"])

        create_pds(combined_data)

        return Response("Hello", status=status.HTTP_201_CREATED)
