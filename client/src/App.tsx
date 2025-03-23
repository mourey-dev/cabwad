import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Employees from "./admin/Employees/Employees";
import Dashboard from "./admin/Dashboard/Dashboard";
import Users from "./admin/Users/Users";
import LoginPage from "./admin/Login/Login";
import Form from "./admin/Form/Form";
import EmployeePersonalDetails from "./admin/EmployeeDetails/EmployeePersonalDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusProvider } from "./context/StatusContext";

// Routes
import { ProtectedRoute, LoginRoute } from "./routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusProvider>
        <Router>
          <Routes>
            <Route element={<LoginRoute />}>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/admin/users/page/:page" element={<Users />} />
              <Route
                path="/admin/employees/page/:pageNumber"
                element={<Employees />}
              />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/form/:page" element={<Form />} />
              <Route
                path="/admin/employee_details/:id"
                element={<EmployeePersonalDetails />}
              />
            </Route>

            {/* NOT INCLUDED ON PATH */}
            <Route path="*" element={<LoginRoute />} />
          </Routes>
        </Router>
      </StatusProvider>
    </QueryClientProvider>
  );
}

export default App;
