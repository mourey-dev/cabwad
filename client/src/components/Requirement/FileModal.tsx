// Hooks
import { useState } from "react";
import {
  useEmployeeFile,
  useUpdateEmployeeFile,
} from "../../hooks/useEmployee";

// Utils
import { convertToBase64 } from "../../utils/fileHandler";

// Types
import { EmployeeData } from "../../types/employee";

// Components
import { Loading } from "../";

type FileModalProps = {
  fileType: string;
  employee: EmployeeData;
  toggleModal: () => void;
  resetDropdown: () => void;
  setResponse: React.Dispatch<
    React.SetStateAction<{
      success: boolean;
      error: boolean;
      message: string;
    }>
  >;
  mode: "add" | "update";
  fileId: string;
};

const FileModal = ({
  fileType,
  employee,
  toggleModal,
  resetDropdown,
  setResponse,
  mode,
  fileId,
}: FileModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutateAsync: uploadFile, isPending: isUploading } = useEmployeeFile();
  const { mutateAsync: updateFile, isPending: isUpdating } =
    useUpdateEmployeeFile();

  const handleFileOperation = async () => {
    if (selectedFile) {
      try {
        const base64 = await convertToBase64(selectedFile);
        const payload = {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileContent: base64,
        };

        const response =
          mode === "add"
            ? await uploadFile({
                file_type: fileType,
                payload,
                employee,
              })
            : await updateFile({
                file_id: fileId,
                file_type: fileType,
                payload,
                employee,
              });

        resetDropdown();
        toggleModal();
        setSelectedFile(null);
        setResponse((prev) => ({
          ...prev,
          success: true,
          message: response.detail,
        }));
      } catch (error) {
        setResponse((prev) => ({
          ...prev,
          error: true,
          message: `Failed to ${mode} file`,
        }));
      }
    }
  };

  const isPending = isUploading || isUpdating;
  if (isPending) return <Loading loading={isPending} />;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {mode === "add" ? "Add New File" : "Update File"}
          </h2>
        </div>
        <input
          title="Select File"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setSelectedFile(file);
            }
          }}
          className="mt-4 w-full rounded border p-2"
        />
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={toggleModal}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleFileOperation}
            disabled={!selectedFile}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {mode === "add" ? "Upload" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileModal;
