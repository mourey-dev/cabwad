import { useState } from "react";

type PDSPostModalProps = {
  url: string;
  employeeId?: string | undefined;
};

const PDSPostModal = ({ url, employeeId = undefined }: PDSPostModalProps) => {
  const [show, setShow] = useState(true);

  const handleStartAgain = () => {
    setShow(false);
    window.location.href = "/form/1";
  };

  const handleView = () => {
    window.open(url, "_blank");
  };

  const handleHome = () => {
    if (employeeId) {
      window.location.href = `/admin/employee_details/${employeeId}`;
      return;
    }
    window.location.href = "/home";
  };

  return (
    <div>
      {show && (
        <div className="bg-opacity-75 fixed inset-0 z-10 flex items-center justify-center bg-gray-800">
          <div className="rounded bg-white p-6 shadow-lg">
            <p className="mb-4 text-center">
              PDS was successfully {employeeId ? "updated" : "created"}.
            </p>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleHome}
                className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
              >
                {employeeId ? "Back" : "Home"}
              </button>
              {employeeId ? (
                ""
              ) : (
                <button
                  type="button"
                  className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
                  onClick={handleStartAgain}
                >
                  Start Again
                </button>
              )}
              <button
                type="button"
                className="rounded bg-green-500 px-4 py-2 text-white"
                onClick={handleView}
              >
                View PDS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDSPostModal;
