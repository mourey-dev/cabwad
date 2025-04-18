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

/**
 * Fetches the employee service record PDF as base64 data
 * The PDF contains all service record information for the specified employee
 *
 * @param employeeId - The employee ID to generate the PDF for
 * @returns An object containing the base64 encoded PDF data and metadata
 */
export const fetchEmployeeServiceRecordPDF = async (employeeId: string) => {
  try {
    const response = await axiosInstance.get<{
      filename: string;
      mime_type: string;
      data: string; // base64 encoded PDF data
      employee_id: string;
      employee_name: string;
    }>(`/service-record/${employeeId}/pdf/`);

    return response.data;
  } catch (error) {
    console.error("Error fetching employee service record PDF:", error);
    throw error;
  }
};

/**
 * Creates a downloadable PDF from the base64 data
 * Triggers a file download in the browser
 *
 * @param employeeId - The employee ID to generate the PDF for
 * @returns A Promise that resolves when the download is initiated
 */
export const downloadEmployeeServiceRecordPDF = async (employeeId: string) => {
  try {
    const pdfData = await fetchEmployeeServiceRecordPDF(employeeId);

    // Convert base64 to blob
    const byteCharacters = atob(pdfData.data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: pdfData.mime_type });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.download = pdfData.filename;
    document.body.appendChild(link);

    // Trigger download and clean up
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    return pdfData;
  } catch (error) {
    console.error("Error downloading employee service record PDF:", error);
    throw error;
  }
};

/**
 * Opens the employee service record PDF in a new browser tab
 * Useful for previewing before downloading
 *
 * @param employeeId - The employee ID to generate the PDF for
 * @returns A Promise that resolves when the PDF is opened
 */
export const openEmployeeServiceRecordPDF = async (employeeId: string) => {
  try {
    const pdfData = await fetchEmployeeServiceRecordPDF(employeeId);

    // Create blob URL
    const byteCharacters = atob(pdfData.data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: pdfData.mime_type });
    const url = URL.createObjectURL(blob);

    // Open in new tab
    window.open(url, "_blank");

    // Clean up the blob URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    return pdfData;
  } catch (error) {
    console.error("Error opening employee service record PDF:", error);
    throw error;
  }
};
