import React from "react";
import Upload from "../../assets/images/upload.png";

interface EmployeeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center shadow-sm">
      <div className="relative w-96 rounded-lg bg-white p-6 shadow-xl">
        <h2 className="font-jost text-center text-xl font-bold">
          PERSONAL DETAIL
        </h2>
        <button
          onClick={onClose}
          className="absolute top-6 right-4 cursor-pointer rounded-full bg-red-400 px-3 py-1 text-center text-white"
        >
          X
        </button>
        <div className="my-4 flex flex-col items-center">
          <div className="flex h-50 w-50 items-center justify-center overflow-hidden border bg-gray-200">
            <img src="" alt="Image" className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-inter">Name:</p>
          <p className="font-inter">Position:</p>
          <p className="font-inter">Department:</p>
          <h3 className="font-jost mt-4 text-center font-bold">
            Educational Background
          </h3>
          <p className="font-inter">Elementary:</p>
          <p className="font-inter">Secondary:</p>
          <p className="font-inter">College:</p>
          <h3 className="font-jost mt-4 text-center font-bold">Contact</h3>
          <p className="font-inter">Phone no.:</p>
          <p className="font-inter">Email:</p>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button className="font-inter flex cursor-pointer items-center rounded-full bg-yellow-500 px-4 py-2 text-white shadow-md transition hover:bg-yellow-600">
            Update
          </button>
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-gray-300">
            <img src={Upload} alt="Upload document button" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
