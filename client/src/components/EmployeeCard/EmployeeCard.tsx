import { EmployeeData } from "../../types/employee";
import remove from "../../assets/images/remove.png";
import plus from "../../assets/images/plus.png";
import displayPic from "../../assets/images/displayPic.png";
import maleEmployee from "../../assets/images/male-employee.jpg";
import femaleEmployee from "../../assets/images/female-employee.jpg";
import { getProfile } from "../../utils/fileHandler";

interface EmployeeCardProps {
  employee: EmployeeData;
  onSelect: (employee: EmployeeData) => void;
  onRemove: (employee: EmployeeData) => void;
  isActive: boolean;
}

const EmployeeCard = ({
  employee,
  onSelect,
  onRemove,
  isActive,
}: EmployeeCardProps) => {
  return (
    <div className="cursor-pointer" onClick={() => onSelect(employee)}>
      <div className="relative flex h-60 w-full flex-col items-center rounded-md bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-600 sm:p-6">
        <button
          type="button"
          className="absolute top-2 right-2 transform cursor-pointer transition-transform duration-300 hover:scale-150"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(employee);
          }}
        >
          <img
            src={isActive ? remove : plus}
            alt="Add/Remove User"
            className="w-6"
          />
        </button>

        <img
          src={getProfile(employee.files) ?? displayPic}
          alt="Employee Icon"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              employee.sex === "MALE" ? maleEmployee : femaleEmployee;
          }}
          className="mt-4 h-[70px] w-[70px] rounded-[50%] border-2 border-slate-300"
        />
        <div className="flex flex-grow flex-col justify-between text-center">
          <p className="mt-2 font-bold text-gray-800">
            {`${employee.first_name} ${employee.surname}`}
          </p>
          <p className="text-sm text-gray-500">{employee.appointment_status}</p>
          <p className="text-xs text-gray-400">{employee.department}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
