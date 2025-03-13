import profile from "../../assets/images/account-black.png";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import usePost from "../../hooks/usePost";

// Component
import Loading from "../Loading";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { loading, response, handlePost } = usePost("/account/api/logout/");

  const handleLogout = async () => {
    const data = { refresh_token: localStorage.getItem("refresh") };
    handlePost(data);
  };

  useEffect(() => {
    if (response) {
      localStorage.removeItem("refresh");
      localStorage.removeItem("access");
      navigate("/");
    }
  }, [response]);

  return (
    <header className="flex items-center justify-between bg-white p-4 text-black shadow-md">
      <Loading loading={loading} />
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="Cabuyao Water District"
          className="mr-2 h-8"
        />
        <h1 className="font-jost">Cabuyao Water District</h1>
      </div>
      <nav className="flex items-center space-x-4">
        <a
          href="/admin/dashboard"
          className="mr-10 font-semibold text-blue-700"
        >
          HOME
        </a>
        <a href="/admin/users" className="mr-10 font-semibold text-blue-700">
          MANAGE USER
        </a>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="cursor-pointer"
          >
            <img src={profile} alt="profile-logo" className="h-6 w-6" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-36 rounded-md border bg-white shadow-lg">
              <button
                type="button"
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
