import React from "react";

interface ViewDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
}

const ViewDocument: React.FC<ViewDocumentProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-30 fixed inset-0 flex items-center justify-center bg-gray-900/50 p-4">
      <div className="relative flex w-[800px] flex-col rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full bg-red-500 px-3 py-1 text-white"
        >
          X
        </button>
        <h2 className="font-jost text-center text-2xl font-bold">
          SUBMITTED DOCUMENTS
        </h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Documents
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Sample Document 1
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="mr-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
                    View
                  </button>
                  <button className="mr-2 rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600">
                    Edit
                  </button>
                  <button className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Sample Document 2
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="mr-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
                    View
                  </button>
                  <button className="mr-2 rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600">
                    Edit
                  </button>
                  <button className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewDocument;
