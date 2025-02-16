import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Employees from "./pages/Employees/Employees";
import Permanents from "./pages/Employees/Permanents";
import Casuals from "./pages/Employees/Casuals";
import JobOrders from "./pages/Employees/JobOrders";
import Resigned from "./pages/Employees/Resigned";
import Dashboard from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/Login/Login";
import Forms from "./pages/Form/Form";
import FormContainer from "./components/Form/FormContainer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/permanents" element={<Permanents />} />
        <Route path="/casuals" element={<Casuals />} />
        <Route path="/jobOrders" element={<JobOrders />} />
        <Route path="/resigned" element={<Resigned />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/form" element={<Navigate to="/form/1" replace />} />
        <Route path="/form/:page" element={<FormContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
