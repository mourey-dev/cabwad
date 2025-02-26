import React from "react";
import Default from "../../assets/images/default.png";

interface EmployeeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-30 fixed inset-0 flex items-center justify-center p-4">
      <div className="relative flex w-[800px] flex-col rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full bg-red-500 px-3 py-1 text-white"
        >
          X
        </button>
        <h2 className="font-jost text-center text-2xl font-bold">
          PERSONAL DETAIL
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
          {/* Left Section */}
          <div className="w-1/2">
            <div className="font-jost mt-4 space-y-2 text-sm">
              <p>Name:</p>
              <p>Position:</p>
              <p>Department:</p>
              <h3 className="mt-7 font-bold">Educational Background</h3>
              <p>Elementary:</p>
              <p>Secondary:</p>
              <p>College:</p>
              <h3 className="mt-7 font-bold">Contact</h3>
              <p>Phone no.:</p>
              <p>Email:</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="font-jost w-1/2">
            <h3 className="font-bold">Documents</h3>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="cursor-pointer text-red-500 hover:underline">
                Certificate of CSC Eligibility
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Diplomas, Commendations and Awards
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Marriage Contract
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Medical Certificate
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                NBI Clearance
              </li>
              <li className="cursor-pointer text-green-500 hover:underline">
                Personal Data Sheet
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Birth Certificate
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Resume, Biodata
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Birth Certificate of Child/ren
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Transcript of Records
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Form 137
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Form 138-A
              </li>
            </ul>
          </div>

          <div className="font-jost w-1/3">
            <ul className="mt-8 space-y-1 text-sm">
              <li className="cursor-pointer text-red-500 hover:underline">
                Driver's License (Photocopy)
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                PRC License (Photocopy)
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Training Certificate
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Appointments
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Assumption of Duty
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Certificate of Leave Balances
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Contract of Services
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Copies of Disciplinary Actions
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Notice of Salary Adjustment/Step Increment
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Oath of Office
              </li>
              <li className="cursor-pointer text-red-500 hover:underline">
                Position Description Forms
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button className="font-jost flex items-center rounded-full bg-yellow-500 px-6 py-2 text-white shadow-md transition hover:bg-yellow-600">
            Update
          </button>
          <button className="font-jost flex items-center rounded-full bg-blue-500 px-6 py-2 text-white shadow-md transition hover:bg-blue-600">
            View Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
