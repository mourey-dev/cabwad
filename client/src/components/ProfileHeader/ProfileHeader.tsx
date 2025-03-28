// Assets
import Default from "../../assets/images/default.png";
import maleEmployee from "../../assets/images/male-employee.jpg";
import femaleEmployee from "../../assets/images/female-employee.jpg";

// State
import { useState } from "react";

// Types
import { EmployeeData } from "../../types/employee";

// Utils
import { getProfile, convertToBase64 } from "../../utils/fileHandler";

// Hooks
import {
  useEmployeeFile,
  useUpdateEmployeeFile,
} from "../../hooks/useEmployee";

// Context
import { useStatus } from "../../context/StatusContext";

// Components
import ContactInfo from "./ContactInfo";
import { ProfileModal, UpdateEmployeeModal } from "../Modal";
import { ActionButton } from "../";
import Loading from "../Loading";
import { AlertError, AlertSuccess } from "../Alert";

type ProfileHeaderProps = {
  employee: EmployeeData;
};

const ProfileHeader = ({ employee }: ProfileHeaderProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { status, setStatus } = useStatus();
  const { mutateAsync: uploadFile, isPending: isUploading } = useEmployeeFile();
  const { mutateAsync: updateFile, isPending: isUpdating } =
    useUpdateEmployeeFile();

  const toggleModal = (
    setModal: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setModal((prev) => !prev);
  };

  const handleChangeProfile = async (file: File) => {
    const profile = employee.files.find((file) => file.file_type === "profile");

    try {
      const base64 = await convertToBase64(file);
      const payload = {
        fileName: file.name,
        fileType: file.type,
        fileContent: base64,
      };

      const response = profile
        ? await updateFile({
            file_id: profile.file_id,
            file_type: profile.file_type,
            payload,
            employee,
          })
        : await uploadFile({
            file_type: "profile",
            payload,
            employee,
          });

      setStatus((prev) => ({
        ...prev,
        success: true,
        message: response.detail,
      }));
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        error: true,
        message: `Failed to update profile`,
      }));
    }
  };

  const isPending = isUploading || isUpdating;
  if (isPending) return <Loading loading={isPending} />;

  return (
    <div className="mb-4 flex items-center border-b pb-4">
      {status.success && <AlertSuccess message={status.message} />}
      {status.error && <AlertError message={status.message} />}
      <UpdateEmployeeModal
        show={showUpdateModal}
        onClose={() => toggleModal(setShowUpdateModal)}
        employee={employee}
      />
      <ProfileModal
        status={showModal}
        toggleStatus={() => toggleModal(setShowModal)}
        handleChangeProfile={handleChangeProfile}
      />
      <img
        src={getProfile(employee.files) ?? Default}
        alt="Profile"
        className="h-32 w-32 object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            employee.sex === "MALE" ? maleEmployee : femaleEmployee;
        }}
      />
      <div className="ml-6">
        <h2 className="text-3xl font-bold">{`${employee.first_name} ${employee.surname}`}</h2>
        <p className="text-gray-600">{`#${employee.employee_id}`}</p>
        <ContactInfo phone={employee.phone} email={employee.email} />
        <div className="mt-4 flex space-x-4">
          <ActionButton
            onClick={() => toggleModal(setShowUpdateModal)}
            label="Update Info"
            className="rounded bg-green-500 px-5 py-2 text-white hover:bg-green-600"
          />
          <ActionButton
            onClick={() => toggleModal(setShowModal)}
            label="Upload Profile Image"
            className="rounded bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
