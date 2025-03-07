import { useEffect, useState } from "react";

// Types
import { EmployeeData } from "../../types/employee";

interface AlertSuccessProps {
  message: string;
  onClose: () => void;
}

const AlertSuccess: React.FC<AlertSuccessProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute top-0 left-10 z-50 my-4 flex max-w-lg items-center rounded-md bg-green-200 px-6 py-4 text-lg">
      <svg
        viewBox="0 0 24 24"
        className="mr-3 h-5 w-5 text-green-600 sm:h-5 sm:w-5"
      >
        <path
          fill="currentColor"
          d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
        ></path>
      </svg>
      <span className="text-green-800">{message}</span>
    </div>
  );
};

export default AlertSuccess;
