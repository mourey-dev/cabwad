import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Employees from "./pages/Employees/Employees";
import Permanents from "./pages/Employees/Permanents";
import Casuals from "./pages/Employees/Casuals";
import JobOrders from "./pages/Employees/JobOrders";
import Resigned from "./pages/Employees/Resigned";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/Login/Login";
import Form from "./pages/Form/Form";

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
          <Route path="/employees" element={<Employees />} />
          <Route path="/permanents" element={<Permanents />} />
          <Route path="/casuals" element={<Casuals />} />
          <Route path="/jobOrders" element={<JobOrders />} />
          <Route path="/resigned" element={<Resigned />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/form/:page" element={<Form />} />
        </Route>

        {/* NOT INCLUDED ON PATH */}
        <Route path="*" element={<LoginRoute />} />
      </Routes>
    </Router>
  );
}

export default App;
