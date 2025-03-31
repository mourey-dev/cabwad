import ActionButton from "../ActionButton";
import { EmployeeFile } from "../../types/employee";
import { useNavigate } from "react-router-dom";

type CustomDropdownProps = {
  employeeFile: EmployeeFile | undefined;
  url: string;
  toggleDeleteModal: () => void;
  handleViewFile: (file: EmployeeFile | undefined) => void;
};

const CustomDropdown = ({
  employeeFile,
  url,
  handleViewFile,
  toggleDeleteModal,
}: CustomDropdownProps) => {
  const navigate = useNavigate();

  return (
    <div className="absolute left-0 z-100 mt-1 w-32 rounded-md bg-white shadow-lg">
      <ActionButton
        label="INSERT"
        disabled={!!employeeFile}
        onClick={() => navigate(`${url}/add`)}
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
        onClick={() => navigate(`${url}/update`)}
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

export default CustomDropdown;
