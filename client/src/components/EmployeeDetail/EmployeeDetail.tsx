// EmployeeDetail.tsx
import React from "react";
import Upload from "../../assets/images/upload.png";

interface EmployeeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-center text-xl font-bold">PERSONAL DETAIL</h2>
        <div className="my-4 flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border bg-gray-200">
            <img
              src="your-upload-icon-path.png"
              alt="Upload Icon"
              className="h-10 w-10 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {employee.first_name} {employee.surname}
          </p>
          <p>
            <strong>Position:</strong> {employee.position}
          </p>
          <p>
            <strong>Department:</strong> {employee.department}
          </p>
          <h3 className="mt-4 font-bold">Educational Background</h3>
          <p>
            <strong>Elementary:</strong> {employee.education.elementary}
          </p>
          <p>
            <strong>Secondary:</strong> {employee.education.secondary}
          </p>
          <p>
            <strong>College:</strong> {employee.education.college}
          </p>
          <h3 className="mt-4 font-bold">Contact</h3>
          <p>
            <strong>Phone no.:</strong> {employee.contact.phone}
          </p>
          <p>
            <strong>Email:</strong> {employee.contact.email}
          </p>
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="rounded bg-gray-400 px-4 py-2 text-white"
          >
            Close
          </button>
          <button className="flex items-center rounded bg-yellow-500 px-4 py-2 text-white">
            Update
          </button>
          <button>
            <img src={Upload} alt="Upload document button" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
