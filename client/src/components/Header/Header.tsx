import profile from "../../assets/images/account-black.png";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 text-black shadow-md">
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="Cabuyao Water District"
          className="mr-2 h-8"
        />
        <h1 className="font-jost">Cabuyao Water District</h1>
      </div>
      <nav className="flex items-center space-x-4">
        <a href="/dashboard" className="mr-10 font-semibold text-blue-700">
          HOME
        </a>
        <div className="relative">
          <button
            className="cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img src={profile} alt="profile-logo" className="h-6 w-6" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-36 rounded-md border bg-white shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full rounded-md px-4 py-1 text-left text-gray-700 hover:bg-gray-400"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
