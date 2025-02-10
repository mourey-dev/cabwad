import { useState } from "react";
import logo from "../../assets/images/logo-white.png";
import accountIcon from "../../assets/images/account-white.png";
import displayPic from "../../assets/images/displayPic.png";
import remove from "../../assets/images/remove-user.png";

const Casuals = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  // Function to handle Remove button click
  const handleRemoveClick = (index: number) => {
    setSelectedUser(index);
    setShowModal(true);
  };

  // Function to confirm user removal
  const confirmRemoveUser = () => {
    console.log(`User ${selectedUser} removed!`);
    setShowModal(false); // Close modal
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 flex justify-between items-center px-6 py-3">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10" />
          <h1 className="text-white text-lg font-bold">
            Cabuyao Water District
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-white font-semibold mr-10">HOME</button>
          <img src={accountIcon} alt="User Icon" className="w-6" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Title */}
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-blue-600">
            CABWAD List of Employees: <span className="text-gray-600">##</span>
          </h2>
        </div>

        {/* Navigation Tabs */}
        <div className="absolute top-20 right-2">
          <button className="text-blue-600 px-4 py-1 rounded hover:border-2 hover:border-blue-600 hover:bg-blue-100 transition duration-300 ">
            Permanents
          </button>
          <button className="text-blue-600 px-4 py-1 rounded hover:border-2 hover:border-blue-600 hover:bg-blue-100 transition duration-300">
            Casuals
          </button>
          <button className="text-blue-600 px-4 py-1 rounded hover:border-2 hover:border-blue-600 hover:bg-blue-100 transition duration-300">
            Job Offers
          </button>
          <button className="text-blue-600 px-4 py-1 rounded hover:border-2 hover:border-blue-600 hover:bg-blue-100 transition duration-300">
            Resigned
          </button>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-5 gap-6 px-6 py-6 mb-23">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-md p-4 flex flex-col items-center relative"
            >
              <button
                className="absolute top-2 right-2"
                onClick={() => handleRemoveClick(index)}
              >
                <img src={remove} alt="Remove User" className="w-6" />
              </button>

              {/* Employee Image and Info */}
              <img src={displayPic} alt="Employee Icon" className="w-16 mt-4" />
              <p className="mt-2 font-bold text-gray-800">Employee Name</p>
              <p className="text-sm text-gray-500">Position</p>
              <p className="text-xs text-gray-400">Department</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer - Sticky at Bottom */}
      <footer className="bg-yellow-500 text-center py-2 text-black font-bold">
        COPYRIGHT © 2025 |{" "}
        <span className="text-blue-600">CABUYAO WATER DISTRICT</span> ALL RIGHTS
        RESERVED
      </footer>

      {/* Modal for Confirming User Removal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-100 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-bold text-gray-800">
              Are you sure you want to remove this employee?
            </h3>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-2 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600"
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

export default Casuals;
