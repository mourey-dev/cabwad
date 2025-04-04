import { Outlet, Navigate } from "react-router-dom";

const LoginRoute = () => {
  const token = localStorage.getItem("access");
  return token ? <Navigate to="/admin/dashboard" /> : <Outlet />;
};

export default LoginRoute;
