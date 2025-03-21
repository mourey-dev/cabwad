import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/images/logo-white.png";
import hide from "../../assets/images/hide.png";
import view from "../../assets/images/view.png";

import usePost from "../../hooks/usePost";

// Component
import Loading from "../../components/Loading";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, errorMessage, response, handlePost } =
    usePost("/account/login/");

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handlePost({ username, password });
  };

  useEffect(() => {
    if (response) {
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      navigate("/dashboard");
    }
  }, [response, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--color-light-blue)">
      {loading && (
        <Loading loading={loading} duration={3000} onClose={() => {}} />
      )}
      {/* Logo */}
      <img src={logo} alt="Cabuyao Water District Logo" className="mb-4 w-24" />

      {/* Title */}
      <h1 className="font-krona-one mb-6 text-3xl text-white">
        CABUYAO WATER DISTRICT
      </h1>

      {/* Login Card */}
      <div className="w-72 rounded-2xl bg-blue-900 p-6 shadow-lg">
        <h2 className="font-krona-one mb-4 text-center text-lg text-white">
          ADMIN
        </h2>

        {/* Error Message */}
        {error && (
          <p className="mb-2 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        {/* Username Input */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="font-inter text-sm text-white">
              Username:
            </label>
            <input
              type="text"
              value={username}
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              required
              className="font-inter w-full rounded-md border border-gray-300 p-2 text-white focus:outline-none"
              autoFocus
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="font-inter text-sm text-white">
              Password:
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-inter w-full rounded-md border border-gray-300 p-2 pr-10 text-white focus:outline-none"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? hide : view}
                  alt="Toggle Password"
                  className="h-5 w-5"
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="font-krona-one w-full cursor-pointer rounded-full bg-white py-2 text-sm text-blue-900 transition duration-300 hover:bg-gray-200"
          >
            LOGIN
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="font-inter absolute bottom-0 mt-6 w-full bg-(--color-yellow) p-4 text-center text-sm text-black">
        COPYRIGHT © 2025 |{" "}
        <span className="font-inter font-bold text-blue-700">
          CABUYAO WATER DISTRICT
        </span>{" "}
        ALL RIGHTS RESERVED
      </footer>
    </div>
  );
};

export default LoginPage;
