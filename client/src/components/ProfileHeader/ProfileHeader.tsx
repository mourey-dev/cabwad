// Assets
import Default from "../../assets/images/default.png";

// Types
import { EmployeeData } from "../../types/employee";

// Utils
import { getProfile } from "../../utils/fileHandler";

// Components
import ContactInfo from "./ContactInfo";
import { ActionButton } from "../";

type ProfileHeaderProps = {
  employee: EmployeeData;
};

export const ProfileHeader = ({ employee }: ProfileHeaderProps) => (
  <div className="mb-4 flex items-center border-b pb-4">
    <img
      src={getProfile(employee.files) ?? Default}
      alt="Profile"
      className="h-32 w-32 object-cover"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = Default;
      }}
    />
    <div className="ml-6">
      <h2 className="text-3xl font-bold">{`${employee.first_name} ${employee.surname}`}</h2>
      <p className="text-gray-600">{`#${employee.employee_id}`}</p>
      <ContactInfo phone={employee.phone} email={employee.email} />
      <div className="mt-4 flex space-x-4">
        <ActionButton
          label="Update Info"
          className="rounded bg-green-500 px-5 py-2 text-white hover:bg-green-600"
        />
        <ActionButton
          label="Upload Profile Image"
          className="rounded bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
        />
      </div>
    </div>
  </div>
);
