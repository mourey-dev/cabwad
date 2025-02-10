import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-white.png";
import hide from "../../assets/images/hide.png";
import view from "../../assets/images/view.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin123" && password === "admin") {
      setError("");
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600">
      {/* Logo */}
      <img src={logo} alt="Cabuyao Water District Logo" className="w-24 mb-4" />

      {/* Title */}
      <h1 className="text-white text-2xl font-bold mb-6">
        CABUYAO WATER DISTRICT
      </h1>

      {/* Login Card */}
      <div className="bg-blue-900 p-6 rounded-2xl shadow-lg w-72">
        <h2 className="text-white text-lg font-bold text-center mb-4">ADMIN</h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        {/* Username Input */}
        <div className="mb-4">
          <label className="text-white text-sm">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none text-white"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="text-white text-sm">Password:</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none text-white"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? hide : view}
                alt="Toggle Password"
                className="w-5"
              />
            </span>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-white text-blue-900 font-bold py-2 rounded-full hover:bg-gray-200 transition duration-300"
        >
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
