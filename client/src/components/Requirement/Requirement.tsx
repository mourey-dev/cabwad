// Types
import { EmployeeFile, FileType, EmployeeData } from "../../types/employee";

// Components
import { ConfirmationModal } from "../Modal";
import { AlertSuccess, AlertError } from "../Alert";
import { ActionButton, Loading } from "../";
import { useState } from "react";
import FileModal from "./FileModal";

// Hooks
import { useDeleteEmployeeFile } from "../../hooks/useEmployee";

type RequirementProps = {
  employee: EmployeeData;
  employeeFile: EmployeeFile | undefined;
  document: { key: string; label: FileType };
  index: number;
  dropdown: number | null;
  fileType: string;
  fileId: string;
  toggleDropdown: (
    index: number,
    type: string,
    file_id: string | undefined,
  ) => void;
  resetDropdown: () => void;
};

const Requirement = ({
  employeeFile,
  document,
  index,
  dropdown,
  toggleDropdown,
  resetDropdown,
  fileType,
  fileId,
  employee,
}: RequirementProps) => {
  const [fileModal, setFileModal] = useState(false);
  const [mode, setMode] = useState<"add" | "update">("add");
  const [deleteModal, setDeleteModal] = useState(false);
  const [response, setResponse] = useState({
    success: false,
    error: false,
    message: "",
  });
  const { mutate: deleteFile, isPending } = useDeleteEmployeeFile();

  const handleViewFile = (file: EmployeeFile | undefined) => {
    if (!file) return;
    window.open(
      `https://drive.google.com/file/d/${file.file_id}/view`,
      "blank",
    );
  };

  const toggleFileModal = () => {
    setFileModal(!fileModal);
  };

  const handleMode = (newMode: "add" | "update") => {
    setMode(newMode);
    toggleFileModal();
  };

  const confirmDelete = () => {
    deleteFile(
      { file_id: fileId, employee },
      {
        onSuccess: (data) => {
          toggleDeleteModal();
          resetDropdown();
          setResponse({ ...response, success: true, message: data.detail });
        },
        onError: () => {
          toggleDeleteModal();
          setResponse({
            ...response,
            error: true,
            message: "Failed to delete File",
          });
        },
      },
    );
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  return (
    <div>
      {response.success && (
        <AlertSuccess
          onClose={() => setResponse({ ...response, success: false })}
          message={response.message}
        />
      )}
      {response.error && (
        <AlertError
          onClose={() => setResponse({ ...response, error: false })}
          message={response.message}
        />
      )}
      <div className="relative">
        {isPending && <Loading loading={isPending} />}

        {fileModal && (
          <FileModal
            fileType={fileType}
            employee={employee}
            toggleModal={toggleFileModal}
            setResponse={setResponse}
            resetDropdown={resetDropdown}
            mode={mode}
            fileId={fileId}
          />
        )}
        {deleteModal && (
          <ConfirmationModal
            onClose={toggleDeleteModal}
            onConfirm={confirmDelete}
            message="Are you sure you want to delete this file? This action cannot be undone."
          />
        )}
        <p
          key={index}
          onClick={() =>
            toggleDropdown(index, document.key, employeeFile?.file_id)
          }
          className={`cursor-pointer select-none hover:underline ${employeeFile ? "text-green-500" : "text-red-500"} uppercase`}
        >
          {document.label}
        </p>

        {dropdown === index && (
          <div className="absolute left-0 z-100 mt-1 w-32 rounded-md bg-white shadow-lg">
            <ActionButton
              label="INSERT"
              disabled={!!employeeFile}
              onClick={() => handleMode("add")}
              className={`block w-full px-4 py-2 text-left text-sm uppercase hover:bg-gray-300 ${!employeeFile ? "" : "disabled:opacity-50"}`}
            />
            <ActionButton
              label="VIEW"
              disabled={!employeeFile}
              onClick={() => handleViewFile(employeeFile)}
              className={`block w-full px-4 py-2 text-left text-sm uppercase hover:bg-gray-300 ${employeeFile ? "" : "disabled:opacity-50"}`}
            />
            <ActionButton
              label="UPDATE"
              disabled={!employeeFile}
              onClick={() => handleMode("update")}
              className={`block w-full px-4 py-2 text-left text-sm uppercase hover:bg-gray-300 ${employeeFile ? "" : "disabled:opacity-50"}`}
            />
            <ActionButton
              label="DELETE"
              disabled={!employeeFile}
              onClick={toggleDeleteModal}
              className={`block w-full px-4 py-2 text-left text-sm uppercase hover:bg-red-200 ${employeeFile ? "" : "disabled:opacity-50"}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default Requirement;
