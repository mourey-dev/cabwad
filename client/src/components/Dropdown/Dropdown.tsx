// Components
import ActionButton from "../ActionButton";

// Types
import { EmployeeFile } from "../../types/employee";

type DropdownProps = {
  employeeFile: EmployeeFile | undefined;
  toggleFileModal: () => void;
  toggleDeleteModal: () => void;
  handleViewFile: (file: EmployeeFile | undefined) => void;
  setMode: (value: React.SetStateAction<"add" | "update">) => void;
};

const Dropdown = ({
  employeeFile,
  toggleFileModal,
  toggleDeleteModal,
  handleViewFile,
  setMode,
}: DropdownProps) => {
  const handleMode = (newMode: "add" | "update") => {
    setMode(newMode);
    toggleFileModal();
  };

  return (
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
  );
};

export default Dropdown;
