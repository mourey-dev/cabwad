import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate

import { useGetQuery } from "../../hooks/useCustomQuery";
import { EmployeeData } from "../../types/employee";
import { Header, Footer, FilterBar, EmployeeCard } from "../../components";
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

const options = [
  "ALL",
  "PERMANENT",
  "CASUAL",
  "JOB ORDER",
  "CO-TERMINUS",
  "CONTRACT OF SERVICE",
  "TEMPORARY",
];

const Employees = () => {
  const navigate = useNavigate(); // Initialize navigate
  const { pageNumber } = useParams();
  const [category, setCategory] = useState("ALL");
  const [isActive, setIsActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(Number(pageNumber) || 1);
  const [pageSize, setPageSize] = useState(20);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<EmployeeData | null>(
    null,
  );
  const { status, setStatus } = useStatus();
  const confirmationMessage = isActive
    ? "Are you sure you want to delete"
    : "Are you sure you want to return";

  // Use custom GET query
  const { data, isLoading: loading } = useGetQuery<PaginatedEmployeesData>(
    [
      "employees",
      category,
      isActive.toString(),
      currentPage.toString(),
      pageSize.toString(),
    ],
    `/employee/list/?category=${category}&is_active=${isActive}&page=${currentPage}&page_size=${pageSize}`,
  );

  // Use custom DELETE mutation
  const {
    mutate: toggleStatus,
    isPending,
    isSuccess,
    isError,
    error,
    data: toggleResponse,
  } = useToggleEmployeeStatus();

  const { prefetchEmployee } = useEmployeeData();

  const handleOpenEmployeePage = (employee: EmployeeData) => {
    prefetchEmployee(employee); // Cache the employee data before navigation
    navigate(`/admin/employee_details/${employee.employee_id}`);
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

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    navigate(`/admin/employees/page/1`);
    setCurrentPage(1);
  };

  const handleActiveChange = (newActive: boolean) => {
    setIsActive(newActive);
    navigate(`/admin/employees/page/1`);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    navigate(`/admin/employees/page/${newPage}`);
  };

  useEffect(() => {
    if (pageNumber && Number(pageNumber) !== currentPage) {
      setCurrentPage(Number(pageNumber));
    }
  }, [pageNumber]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {loading && <Loading loading={loading} />}
      {isPending && <Loading loading={true} />}
      {status.success && isSuccess && (
        <AlertSuccess
          message={
            toggleResponse?.detail ||
            `Employee ${isActive ? "deactivated" : "activated"} successfully`
          }
        />
      )}
      {status.error && isError && (
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
          {!data?.count ? (
            ""
          ) : (
            <Pagination
              currentPage={data.current_page}
              totalPages={data.total_pages}
              pageSize={pageSize}
              hasNext={!!data.links.next}
              hasPrevious={!!data.links.previous}
              onPageChange={handlePageChange}
              onPageSizeChange={setPageSize}
            />
          )}
          <div>
            <FilterBar
              category={category}
              onCategoryChange={handleCategoryChange}
              isActive={isActive}
              onActiveChange={handleActiveChange}
              options={options}
            />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.results?.map((item) => (
            <EmployeeCard
              key={item.employee_id}
              employee={item}
              isActive={isActive}
              onSelect={handleOpenEmployeePage}
              onRemove={handleOpenConfirmModal}
            />
          ))}
        </div>
        {data?.count && data.count >= 10 ? (
          <Pagination
            currentPage={data.current_page}
            totalPages={data.total_pages}
            pageSize={pageSize}
            hasNext={!!data.links.next}
            hasPrevious={!!data.links.previous}
            onPageChange={handlePageChange}
            onPageSizeChange={setPageSize}
          />
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default Employees;
