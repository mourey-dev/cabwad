// Types
import { EmployeeFile, FileType, EmployeeData } from "../../types/employee";

// Components
import { ConfirmationModal } from "../Modal";
import { AlertSuccess, AlertError } from "../Alert";
import { Loading } from "../";
import { useState } from "react";
import FileModal from "./FileModal";
import Dropdown from "../Dropdown";

// Hooks
import { useDeleteEmployeeFile } from "../../hooks/useEmployee";

// Context
import { useStatus } from "../../context/StatusContext";

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
  const { status, setStatus, resetStatus } = useStatus();
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

  const confirmDelete = () => {
    deleteFile(
      { file_id: fileId, employee },
      {
        onSuccess: (data) => {
          toggleDeleteModal();
          resetDropdown();
          setStatus({ ...status, success: true, message: data.detail });
        },
        onError: () => {
          toggleDeleteModal();
          setStatus({
            ...status,
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
      {status.success && (
        <AlertSuccess onClose={resetStatus} message={status.message} />
      )}
      {status.error && (
        <AlertError onClose={resetStatus} message={status.message} />
      )}
      <div className="relative">
        {isPending && <Loading loading={isPending} />}

        {fileModal && (
          <FileModal
            fileType={fileType}
            employee={employee}
            toggleModal={toggleFileModal}
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
          <Dropdown
            employeeFile={employeeFile}
            toggleFileModal={toggleFileModal}
            toggleDeleteModal={toggleDeleteModal}
            handleViewFile={() => handleViewFile(employeeFile)}
            setMode={setMode}
          />
        )}
      </div>
    </div>
  );
};
export default Requirement;
