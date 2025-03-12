import { EmployeeFile } from "../types/employee";

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const getProfile = (files: EmployeeFile[]) => {
  const profile = files.find((file) => file.file_type === "profile");

  if (profile) {
    return `https://drive.google.com/thumbnail?id=${profile.file_id}`;
  }

  return null;
};
