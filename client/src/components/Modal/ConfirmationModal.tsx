interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  isError?: boolean;
}

const ConfirmationModal = ({
  onClose,
  onConfirm,
  message,
  isError = false,
}: ConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/50">
      <div className="max-w-sm rounded-lg border bg-white shadow">
        <div className="flex justify-end p-2">
          <button
            title="Close Modal"
            onClick={onClose}
            type="button"
            className="ml-auto inline-flex cursor-pointer items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-6 pt-0 text-center">
          <svg
            className={`mx-auto h-20 w-20 ${isError ? "text-red-600" : "text-green-600"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mt-5 mb-6 text-xl font-normal text-gray-500">
            {message}
          </h3>
          <button
            type="button"
            onClick={onConfirm}
            className={`mr-2 inline-flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-base font-medium text-white focus:ring-4 ${isError ? "bg-red-600 hover:bg-red-800 focus:ring-red-300" : "bg-green-600 hover:bg-green-800 focus:ring-green-300"}`}
          >
            Yes, I'm sure
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
