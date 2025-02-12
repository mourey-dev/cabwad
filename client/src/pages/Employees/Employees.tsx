import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-white.png";
import accountIcon from "../../assets/images/account-white.png";
import displayPic from "../../assets/images/displayPic.png";
import remove from "../../assets/images/remove-user.png";

const Employees = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleRemoveClick = (index: number) => {
    setSelectedUser(index);
    setShowModal(true);
  };

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/");
  };

  const confirmRemoveUser = () => {
    console.log(`User ${selectedUser} removed!`);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 flex justify-between items-center px-6 py-3">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8 w-9 mr-2" />
          <h1 className="text-white text-lg font-jost">
            Cabuyao Water District
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white mr-10 cursor-pointer font-inter"
          >
            HOME
          </button>
          <div className="flex items-center space-x-2">
            <button
              className="cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img src={accountIcon} alt="user icon" className="w-6 h-6" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-18 mr-5 w-36 bg-white border rounded-md shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-1 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4">
        {/* Title */}
        <h2 className="text-xl font text-blue-600 font-krona-one">
          CABWAD List of Employees: <span className="text-gray-600">##</span>
        </h2>

        {/* Navigation Tabs */}
        <div className="absolute top-20 right-2 font-krona-one text-xs">
          {[
            { label: "Permanents", path: "/Permanents" },
            { label: "Casuals", path: "/Casuals" },
            { label: "Job Orders", path: "/JobOrders" },
            { label: "Resigned", path: "/Resigned" },
          ].map(({ label, path }) => (
            <button
              key={label}
              onClick={() => {
                console.log(`Navigating to ${path}`);
                navigate(path);
              }}
              className="text-blue-600 px-4 py-1 rounded hover:border-2 hover:border-blue-600 hover:bg-blue-100 transition duration-300 mx-1 cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-5 gap-6 py-6">
          {[...Array(10)].map((_, index: number) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-md p-4 flex flex-col items-center relative"
            >
              <button
                className="absolute top-2 right-2"
                onClick={() => handleRemoveClick(index)}
              >
                <img src={remove} alt="Remove User" className="w-6 cursor-pointer"/>
              </button>

              {/* Employee Image and Info */}
              <img src={displayPic} alt="Employee Icon" className="w-16 mt-4" />
              <p className="mt-2 font-bold text-gray-800 font-inter">Employee Name</p>
              <p className="text-sm text-gray-500 font-inter">Position</p>
              <p className="text-xs text-gray-400 font-inter">Department</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer - Sticky at Bottom */}
      <footer className="bg-yellow-500 text-center py-2 text-black mt-auto font-inter">
        COPYRIGHT © 2025 |{" "}
        <span className="text-blue-600 font-inter font-bold">CABUYAO WATER DISTRICT</span> ALL RIGHTS
        RESERVED
      </footer>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="absolute inset-0 bg-blue-900 opacity-75"></div>

          {/* Modal Card */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg z-10">
            <h3 className="text-lg font-bold text-gray-800">
              Are you sure you want to remove this employee?
            </h3>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                onClick={confirmRemoveUser}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
