import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate

import { useGetQuery, useDeleteMutation } from "../../hooks/useCustomQuery";
import { EmployeeData } from "../../types/employee";
import { Header, Footer, FilterBar, EmployeeCard } from "../../components";
import Loading from "../../components/Loading";
import ConfirmModal from "../../components/ConfirmDelete/ConfirmModal";
import Pagination from "../../components/Pagination";
import { AlertSuccess, AlertError } from "../../components/Alert";

import { useEmployeeData } from "../../hooks/useEmployee";

// Types
import {
  DeleteEmployeeResponse,
  PaginatedEmployeesData,
} from "../../types/employee";

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
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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
  const deleteMutation = useDeleteMutation<DeleteEmployeeResponse>(
    "/employee/list/",
    ["employees"],
  );

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
      deleteMutation.mutate(employeeToRemove.employee_id, {
        onSuccess: () => {
          setShowDeleteAlert(true);
          handleCloseConfirmModal();
        },
        onError: (error) => {
          setShowDeleteAlert(true);
        },
      });
    }
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
      {deleteMutation.isPending && <Loading loading={true} />}
      {showDeleteAlert && deleteMutation.isSuccess && (
        <AlertSuccess
          message={
            deleteMutation.data?.detail || "Employee deleted successfully"
          }
          onClose={() => setShowDeleteAlert(false)}
        />
      )}
      {showDeleteAlert && deleteMutation.isError && (
        <AlertError
          message={
            (deleteMutation.error as Error)?.message || "An error occurred"
          }
          onClose={() => setShowDeleteAlert(false)}
        />
      )}
      {isConfirmModalOpen && employeeToRemove && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleRemoveEmployee}
          employee={employeeToRemove}
        />
      )}
      <Header />
      <main className="mb-4 flex-1">
        <div className="right-2 flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-blue-600">
              CABWAD List of Employees:{" "}
              <span className="text-gray-600">##</span>
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
              onCategoryChange={setCategory}
              isActive={isActive}
              onActiveChange={setIsActive}
              options={options}
            />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.results?.map((item) => (
            <EmployeeCard
              key={item.employee_id}
              employee={item}
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
