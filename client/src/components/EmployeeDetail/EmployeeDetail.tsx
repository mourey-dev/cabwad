import React, { useState } from "react";
import Default from "../../assets/images/default.png";
import ViewDocument from "./ViewDocument";
import Close from "../../assets/images/close.png";

import { EmployeeData, FileType } from "../../types/employee";

// Components
import EmployeeUpdateModal from "../EmployeeDetail/UpdateDetail/UpdateDetail";

interface EmployeeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeData;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  const [isViewDocumentOpen, setIsViewDocumentOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  if (!isOpen) return null;

  const toggleDropdown = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const documents = Object.entries(FileType).map(([key, value]) => ({
    key,
    label: value,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="relative flex w-[1200px] flex-col rounded-lg bg-white p-6 shadow-xl">
        <button
          type="button"
          title="Close Modal"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer px-3 py-1 text-white"
        >
          <img src={Close} alt="" className="h-8 w-8" />
        </button>
        <h2 className="font-jost text-center text-2xl font-bold">
          PERSONAL INFORMATION
        </h2>
        <div className="flex flex-col items-center">
          <div className="mt-5 flex h-45 w-45 items-center justify-center overflow-hidden border bg-white">
            <img
              src={Default}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex">
          <div className="w-1/2">
            <div className="font-jost mt-4 space-y-2 text-sm">
              <h3 className="font-bold">Employee Details</h3>
              <p className="text-gray-800">ID NO.:</p>
              <p className="text-gray-800">
                LAST NAME: {`${employee.surname}`}
              </p>
              <p className="text-gray-800">
                FIRST NAME:{`${employee.first_name}`}
              </p>
              <p className="text-gray-800">MIDDLE NAME:</p>
              <p className="text-gray-800">SEX:</p>
              <p className="text-gray-800">CIVIL STATUS:</p>

              <h3 className="mt-4 font-bold">Contact</h3>
              <p className="text-gray-800">PHONE NO.:</p>
              <p className="text-gray-800">EMAIL:</p>
            </div>
          </div>

          <div className="font-jost mt-2 w-1/2 space-y-2 text-sm">
            <h3 className="mt-2 font-bold">Employment Details</h3>
            <p className="text-gray-800">
              APPOINTMENT STATUS: {employee.position}
            </p>
            <p className="text-gray-800">CIVIL SERVICE ELIGIBILITY:</p>
            <p className="text-gray-800">POSITION:</p>
            <p className="text-gray-800">DATE OF BIRTH:</p>
            <p className="text-gray-800">FIRST DAY OF SERVICE:</p>
          </div>

          <div className="mr-auto w-4/5">
            <h3 className="font-jost mt-2 font-bold">Documents</h3>
            <div className="font-jost grid grid-cols-2 text-sm">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer hover:underline"
                >
                  <div
                    onClick={() => toggleDropdown(index)}
                    className={`${employee.files.find((file) => file.file_type == doc.key) ? "text-green-500" : "text-red-500"}`}
                  >
                    {doc.label}
                  </div>
                  {dropdownOpen === index && (
                    <div className="absolute left-0 z-100 mt-1 w-32 rounded-md bg-white shadow-lg">
                      <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-300">
                        View
                      </button>
                      <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-300">
                        Edit
                      </button>
                      <button className="block w-full px-4 py-2 text-left text-sm hover:bg-red-200">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            className="font-jost flex items-center rounded-full bg-yellow-500 px-6 py-2 text-white shadow-md transition hover:bg-yellow-600"
            onClick={() => setIsUpdateModalOpen(true)} // Open update modal
          >
            Update
          </button>
          <button
            className="font-jost flex items-center rounded-full bg-blue-500 px-6 py-2 text-white shadow-md transition hover:bg-blue-600"
            onClick={() => setIsViewDocumentOpen(true)}
          >
            View Documents
          </button>
        </div>
      </div>

      {isViewDocumentOpen && (
        <ViewDocument
          isOpen={isViewDocumentOpen}
          onClose={() => setIsViewDocumentOpen(false)}
          employee={null}
        />
      )}

      {isUpdateModalOpen && (
        <EmployeeUpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          employee={employee}
        />
      )}
    </div>
  );
};

export default EmployeeDetail;
