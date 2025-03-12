import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Employees from "./admin/Employees/Employees";
import Dashboard from "./admin/Dashboard/Dashboard";
import Users from "./admin/Users/Users";
import LoginPage from "./admin/Login/Login";
import Form from "./admin/Form/Form";

// Routes
import { ProtectedRoute, LoginRoute } from "./routes";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<LoginRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/form/:page" element={<Form />} />
        </Route>

        {/* NOT INCLUDED ON PATH */}
        <Route path="*" element={<LoginRoute />} />
      </Routes>
    </Router>
  );
}

export default App;
