import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Employees from "./pages/Employees/Employees";
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
