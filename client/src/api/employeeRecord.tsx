import { ServiceRecordFormType } from "../types/service_record";
import axiosInstance from "../instance";

export const fetchEmployeeServiceRecord = async (employeeId: string) => {
  try {
    const response = await axiosInstance.get<ServiceRecordFormType>(
      `/service-record/${employeeId}/`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching employee records:", error);
    throw error;
  }
};

export const addOrUpdateEmployeeServiceRecord = async (
  employeeId: string,
  data: ServiceRecordFormType,
) => {
  try {
    const response = await axiosInstance.post<ServiceRecordFormType>(
      `/service-record/${employeeId}/`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error adding/updating employee record:", error);
    throw error;
  }
};
