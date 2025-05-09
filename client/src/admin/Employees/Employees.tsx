import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useGetQuery } from "../../hooks/useCustomQuery";
import { EmployeeData } from "../../types/employee";
import { Header, Footer, FilterBar, EmployeeCard } from "../../components";
import SearchBar from "../../components/SearchBar";
import Loading from "../../components/Loading";
import { ConfirmationModal } from "../../components/Modal";
import Pagination from "../../components/Pagination";
import { AlertSuccess, AlertError } from "../../components/Alert";

// Context
import { useStatus } from "../../context/StatusContext";

import {
  useEmployeeData,
  useToggleEmployeeStatus,
} from "../../hooks/useEmployee";

// Utils
import { formatName } from "../../utils/formatters";

// Types
import { PaginatedEmployeesData } from "../../types/employee";

const options = ["ALL", "PERMANENT", "CASUAL", "JOB ORDER"];

const Employees = () => {
  const {
    pageNumber = "1",
    category = "all",
    status: active = "active",
  } = useParams();
  const isActive = active === "active";

  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<EmployeeData | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // Debounced search query
  const [isServiceRecord, setIsServiceRecord] = useState(() => {
    const savedValue = localStorage.getItem("isServiceRecord");
    return savedValue ? JSON.parse(savedValue) === true : false;
  }); // State for service record toggle

  const { status, setStatus } = useStatus();
  const confirmationMessage = isActive
    ? "Are you sure you want to delete"
    : "Are you sure you want to return";

  // Debounce the search query to avoid making too many requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000); // Wait 300ms after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Use custom GET query with search query as a dependency
  const { data, isLoading: loading } = useGetQuery<PaginatedEmployeesData>(
    [
      "employees",
      category,
      isActive.toString(),
      pageNumber.toString(),
      debouncedSearchQuery,
    ],
    `/employee/list/?category=${category.toUpperCase()}&is_active=${isActive}&page=${pageNumber}&search=${encodeURIComponent(debouncedSearchQuery)}`,
  );

  // Use custom DELETE mutation
  const {
    mutate: toggleStatus,
    isPending,
    error,
    data: toggleResponse,
  } = useToggleEmployeeStatus();

  const { prefetchEmployee } = useEmployeeData();

  const toggleServiceRecord = () => {
    setIsServiceRecord((prev) => {
      const newValue = !prev;
      // Save to localStorage whenever the value changes
      localStorage.setItem("isServiceRecord", JSON.stringify(newValue));
      return newValue;
    });
  };

  const handleOpenEmployeePage = (employee: EmployeeData) => {
    if (isServiceRecord) {
      navigate(
        `/admin/service_record/service_record_form/${employee.employee_id}`,
      );
    } else {
      prefetchEmployee(employee); // Cache the employee data before navigation
      navigate(`/admin/employee_details/${employee.employee_id}`);
    }
  };

  const handleOpenConfirmModal = (employee: EmployeeData) => {
    setEmployeeToRemove(employee);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setEmployeeToRemove(null);
  };

  const handleRemoveEmployee = () => {
    if (employeeToRemove) {
      const action = isActive ? "deactivate" : "activate";

      toggleStatus(
        {
          employeeId: employeeToRemove.employee_id,
          action,
        },
        {
          onSuccess: () => {
            setStatus({
              ...status,
              success: true,
              message: `Employee ${isActive ? "deactivated" : "activated"} successfully`,
            });
            handleCloseConfirmModal();
          },
          onError: () => {
            setStatus({
              ...status,
              success: false,
              message: "An error occurred",
            });
          },
        },
      );
    }
  };

  const updateNavigation = (
    newCategory: string,
    newActive: string,
    newPageNumber: string,
  ) => {
    navigate(
      `/admin/employees/page/${newPageNumber}/${newCategory.toLowerCase()}/${newActive}`,
    );
  };

  const handleCategoryChange = (newCategory: string) => {
    updateNavigation(newCategory, active, "1");
  };

  const handleActiveChange = (newActive: boolean) => {
    updateNavigation(category, newActive ? "active" : "inactive", "1");
  };

  const handlePageChange = (newPage: number) => {
    updateNavigation(category, active, newPage.toString());
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Reset to first page when search changes
    if (pageNumber !== "1") {
      updateNavigation(category, active, "1");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {loading && <Loading loading={loading} />}
      {isPending && <Loading loading={true} />}
      {status.success && (
        <AlertSuccess
          message={
            toggleResponse?.detail ||
            `Employee ${isActive ? "deactivated" : "activated"} successfully`
          }
        />
      )}
      {status.error && (
        <AlertError
          message={(error as Error)?.message || "An error occurred"}
        />
      )}
      {isConfirmModalOpen && employeeToRemove && (
        <ConfirmationModal
          onClose={handleCloseConfirmModal}
          onConfirm={handleRemoveEmployee}
          message={`${confirmationMessage} ${formatName(employeeToRemove.first_name, employeeToRemove.surname)}?`}
          isError={isActive}
        />
      )}
      <Header />
      <main className="mb-4 flex-1">
        <div className="right-2 flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-blue-600">
              CABWAD List of Employees:{" "}
              <span className="text-blue-800">{data?.count}</span>
            </h2>
          </div>
          <div className="flex flex-grow justify-center">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange} // Use the new handler
              placeholder="Search employees..."
            />
          </div>
          <div className="flex gap-4">
            <FilterBar
              category={category}
              isServiceRecord={isServiceRecord}
              toggleServiceRecord={toggleServiceRecord}
              onCategoryChange={handleCategoryChange}
              isActive={isActive}
              onActiveChange={handleActiveChange}
              options={options}
            />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.results?.map(
            (
              item, // Use data.results directly, no need for filteredEmployees
            ) => (
              <EmployeeCard
                key={item.employee_id}
                employee={item}
                isActive={isActive}
                onSelect={handleOpenEmployeePage}
                onRemove={handleOpenConfirmModal}
              />
            ),
          )}
        </div>
        {data?.count && data.count >= 10 ? (
          <Pagination
            currentPage={data.current_page}
            totalPages={data.total_pages}
            hasNext={!!data.links.next}
            hasPrevious={!!data.links.previous}
            onPageChange={handlePageChange}
          />
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default Employees;
