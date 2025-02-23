import { useState } from "react";

const PDSPostModal = ({ url }: { url: string }) => {
  const [show, setShow] = useState(true);

  const handleStartAgain = () => {
    setShow(false);
    window.location.href = "/form/1";
  };

  const handleView = () => {
    window.open(url, "_blank");
  };

  return (
    <div>
      {show && (
        <div className="bg-opacity-75 fixed inset-0 z-10 flex items-center justify-center bg-gray-800">
          <div className="rounded bg-white p-6 shadow-lg">
            <p className="mb-4">PDS was successfully created.</p>
            <button
              type="button"
              className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
              onClick={handleStartAgain}
            >
              Start Again
            </button>
            <button
              type="button"
              className="rounded bg-green-500 px-4 py-2 text-white"
              onClick={handleView}
            >
              View PDS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDSPostModal;
