import React from "react";

interface ErrorModalProps {
  statusCode: number;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  statusCode,
  message,
  onClose,
}) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold text-red-600">Error {statusCode}</h2>
        <p className="mt-2 text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
