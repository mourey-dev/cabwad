import logo from "../../assets/images/logo-white.png";
import hide from "../../assets/images/hide.png";
import view from "../../assets/images/view.png";
const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600">
      {/* Logo */}
      <img src={logo} alt="Cabuyao Water District Logo" className="w-24 mb-4" />

      {/* Title */}
      <h1 className="text-white text-2xl font-bold mb-6">
        CABUYAO WATER DISTRICT
      </h1>

      {/* Login Card */}
      <div className="bg-blue-900 p-6 rounded-2xl shadow-lg w-70">
        <h2 className="text-white text-lg font-bold text-center mb-4">ADMIN</h2>

        {/* Username Input */}
        <div className="mb-4">
          <label className="text-white text-sm">Username:</label>
          <input
            type="text"
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="text-white text-sm">Password:</label>
          <div className="relative">
            <input
              type="password"
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none"
            />
            <span className="absolute right-3 top-3 cursor-pointer">
              <img src={view} alt="Hide Password Icon" className="w-5" />
            </span>
          </div>
        </div>

        {/* Login Button */}
        <button className="w-40 bg-white text-blue-900 font-bold py-2 rounded-full hover:bg-gray-200 ml-9">
          LOGIN
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full text-center bg-yellow-400 text-black text-sm p-2 mt-6">
        COPYRIGHT © 2025 |{" "}
        <span className="text-blue-700 font-bold">CABUYAO WATER DISTRICT</span>{" "}
        ALL RIGHTS RESERVED
      </footer>
    </div>
  );
};

export default LoginPage;
