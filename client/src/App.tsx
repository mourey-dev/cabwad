import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react"; // Add these imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusProvider } from "./context/StatusContext";
import Loading from "./components/Loading"; // Make sure you have this component
import { ToastContainer } from "react-toastify";

// Routes
import { ProtectedRoute, LoginRoute } from "./routes";

// Lazy load components instead of importing directly
const Employees = lazy(() => import("./admin/Employees/Employees"));
const Dashboard = lazy(() => import("./admin/Dashboard/Dashboard"));
const Users = lazy(() => import("./admin/Users/Users"));
const LoginPage = lazy(() => import("./admin/Login/Login"));
const Form = lazy(() => import("./admin/Form/Form"));
const EmployeePersonalDetails = lazy(
  () => import("./admin/EmployeeDetails/EmployeePersonalDetails"),
);
const ServiceRecord = lazy(() => import("./admin/ServiceRecord/ServiceRecord"));
const ServiceRecordForm = lazy(
  () => import("./components/Form/Files/ServiceRecordForm"),
);
const Backup = lazy(() => import("./admin/Backup/Backup"));

// Create an optimized query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Router>
          {/* Wrap routes in Suspense for lazy loading */}
          <Suspense fallback={<Loading loading={true} />}>
            <Routes>
              <Route element={<LoginRoute />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/admin/users/page/:page" element={<Users />} />
                <Route
                  path="/admin/employees/page/:pageNumber/:category/:status"
                  element={<Employees />}
                />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/form/:page" element={<Form />} />
                <Route
                  path="/admin/form/:page/:employeeId/:mode"
                  element={<Form />}
                />
                <Route
                  path="/admin/employee_details/:id"
                  element={<EmployeePersonalDetails />}
                />
                <Route
                  path="/admin/service_record"
                  element={<ServiceRecord />}
                />
                <Route
                  path="/admin/service_record/service_record_form/:employeeId"
                  element={<ServiceRecordForm />}
                />
                <Route path="/admin/backup" element={<Backup />} />
              </Route>

              {/* NOT INCLUDED ON PATH */}
              <Route path="*" element={<LoginRoute />} />
            </Routes>
          </Suspense>
        </Router>
      </StatusProvider>
    </QueryClientProvider>
  );
}

export default App;
