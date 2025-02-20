from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .classes.personal_data_sheet import PersonalDataSheet


class EmployeeView(APIView):
    def post(self, request):
        data = request.data
        print(data)
        # personal_data_sheet = PersonalDataSheet()

        # for key, value in data.items():
        #     personal_data_sheet.add_data(key, value)

        # return Response(personal_data_sheet.data, status=status.HTTP_201_CREATED)
