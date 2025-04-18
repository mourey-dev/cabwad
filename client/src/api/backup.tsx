import axiosInstance from "../instance";

// Get all backups
export const fetchBackups = async () => {
  const response = await axiosInstance.get("/backup/");
  return response.data;
};

// Create a new backup
export const createBackup = async (options: {
  compress: boolean;
  upload_drive: boolean;
  monthly_folders: boolean;
}) => {
  const response = await axiosInstance.post("/backup/", options);
  return response.data;
};

// Delete a backup
export const deleteBackup = async ({
  id,
  deleteFile = true,
}: {
  id: number;
  deleteFile?: boolean;
}) => {
  const response = await axiosInstance.delete(
    `/backup/${id}/?delete_file=${deleteFile}`,
  );
  return response.data;
};

// Download a backup
export const downloadBackup = async (id: number) => {
  const response = await axiosInstance.get(`/backup/${id}/download/`, {
    responseType: "blob",
  });

  // Create a blob URL and trigger download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;

  // Get filename from Content-Disposition header if available
  const contentDisposition = response.headers["content-disposition"];
  let filename = `backup-${id}.sql`;

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return response.data;
};

// Execute a backup operation (cleanup, restore, etc.)
export const executeBackupOperation = async ({
  operation,
  parameters,
}: {
  operation: string;
  parameters: any;
}) => {
  const response = await axiosInstance.post("/backup/execute/", {
    operation,
    parameters,
  });
  return response.data;
};
