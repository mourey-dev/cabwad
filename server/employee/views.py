from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .utilities.update_dict_key import update_dict_key
from .utilities.create_pds import create_pds


class EmployeeView(APIView):
    def post(self, request):
        data = request.data
        update_dict_key(data["learning_development"])
        update_dict_key(data["civil_service_eligibility"])
        update_dict_key(data["work_experience"])
        update_dict_key(data["voluntary_work"])
        update_dict_key(data["other_information"]["skills"])

        combined_data = {}
        combined_data.update(data["personal_information"])
        combined_data.update(data["family_background"])
        combined_data.update(data["educational_background"])
        combined_data.update(
            {"civil_service_eligibility": data["civil_service_eligibility"]}
        )
        combined_data.update({"work_experience": data["work_experience"]})
        combined_data.update({"voluntary_work": data["voluntary_work"]})
        combined_data.update({"learning_development": data["learning_development"]})
        combined_data.update(data["other_information"])

        create_pds(combined_data)

        return Response("Hello", status=status.HTTP_201_CREATED)
