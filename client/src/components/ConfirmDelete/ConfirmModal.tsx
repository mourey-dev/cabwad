interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employee: {
    first_name: string;
    surname: string;
  };
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  employee,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <p className="text-lg font-bold">Confirm Removal</p>
        <p className="text-gray-700">
          Are you sure you want to remove {employee?.first_name}{" "}
          {employee?.surname}?
        </p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
