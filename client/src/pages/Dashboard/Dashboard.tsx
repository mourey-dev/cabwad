import { useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/images/account-black.png";
import arrow from "../../assets/images/right-arrow.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blue-600 text-white flex flex-col">
      {/* Header */}
      <header className="bg-white text-black flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Cabuyao Water District"
            className="h-8 mr-2"
          />
          <h1 className="font-jost">Cabuyao Water District</h1>
        </div>
        <nav className="flex items-center space-x-4 relative">
          <a href="#" className="text-blue-700 mr-10 font-inter">
            HOME
          </a>

          <div className="relative">
            <button
              className="cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img src={profile} alt="profile-logo" className="w-6 h-6" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-1 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-3xl font-krona-one">EMPLOYEE MANAGEMENT SYSTEM</h2>
        <p className="mt-15 grid grid-cols-1 md:grid-cols-3 gap-69 font-inter text-sm">SUMMARY</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold font-inter">Permanents:</h3>
            <p className="text-2xl font-bold">##</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold font-inter">Casuals:</h3>
            <p className="text-2xl font-bold">##</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold font-inter">Job Orders:</h3>
            <p className="text-2xl font-bold">##</p>
          </div>
        </div>
        <div className="mt-2">
          <button
            onClick={() => navigate("/employees")}
            className="text-sm underline hover:text-blue-500 cursor-pointer font-inter"
          >
            See List &gt; &gt;
          </button>
        </div>
        <div className="mt-6">
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-bold flex items-center hover:bg-green-300 cursor-pointer"
            onClick={() => navigate("/form/1")}
          >
            PDS Form
            <span className="ml-2 text-xl">
              <img src={arrow} alt="right-arrow" className="w-5" />
            </span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-yellow-500 text-black text-center p-4 font-inter">
        <p>
          COPYRIGHT © 2025 |{" "}
          <span className="text-blue-700 font-semibold font-inter">
            CABUYAO WATER DISTRICT
          </span>{" "}
          ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
