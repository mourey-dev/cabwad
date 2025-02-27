import React, { useState } from "react";
import Default from "../../assets/images/default.png";
import ViewDocument from "./ViewDocument";

interface EmployeeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ isOpen, onClose }) => {
  const [isViewDocumentOpen, setIsViewDocumentOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  if (!isOpen) return null;

  const toggleDropdown = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const documents = [
    "Certificate of CSC Eligibility",
    "Diplomas, Commendations and Awards",
    "Marriage Contract",
    "Medical Certificate",
    "NBI Clearance",
    "Personal Data Sheet",
    "Birth Certificate",
    "Resume, Biodata",
    "Birth Certificate of Child/ren",
    "Transcript of Records",
    "Form 137",
    "Form 138-A",
    "Driver's License (Photocopy)",
    "PRC License (Photocopy)",
    "Training Certificate",
    "Appointments",
    "Assumption of Duty",
    "Certificate of Leave Balances",
    "Contract of Services",
    "Copies of Disciplinary Actions",
    "Notice of Salary Adjustment/Step Increment",
    "Oath of Office",
    "Position Description Forms",
    "SSS",
    "Pag-ibig",
    "Philhealth",
    "TIN No.",
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="relative flex w-[1200px] flex-col rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full bg-red-500 px-3 py-1 text-white"
        >
          X
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

        <div className="mt-4 flex gap-6">
          <div className="w-1/2">
            <div className="font-jost mt-4 space-y-2 text-sm">
              <p>ID No.:</p>
              <p>Last Name:</p>
              <p>First Name:</p>
              <p>Middle Name:</p>
              <p>Sex:</p>
              <p>Civil Status:</p>
              <p>Appointment Status:</p>
              <p>Civil Service Eligibility:</p>
              <p>Position:</p>
              <p>Date of Birth:</p>
              <p>First Day of Service:</p>

              <h3 className="mt-7 font-bold">Contact</h3>
              <p>Phone no.:</p>
              <p>Email:</p>
            </div>
          </div>

          <div className="w-1/2">
            <h3 className="font-bold">Documents</h3>
            <div className="grid grid-cols-2 gap-1 text-sm">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer hover:underline"
                >
                  <div onClick={() => toggleDropdown(index)}>{doc}</div>
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
          <button className="font-jost flex items-center rounded-full bg-yellow-500 px-6 py-2 text-white shadow-md transition hover:bg-yellow-600">
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
    </div>
  );
};

export default EmployeeDetail;
