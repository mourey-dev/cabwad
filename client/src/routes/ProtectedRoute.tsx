import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("access");

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
