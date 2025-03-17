import { useEffect, useState } from "react";
import remove from "../../assets/images/remove-user.png";
import displayPic from "../../assets/images/displayPic.png";
import { useGet } from "../../hooks";
import { EmployeesData, EmployeeData } from "../../types/employee";
import { Header, Footer } from "../../components";
import Loading from "../../components/Loading";
import EmployeeDetail from "../../components/EmployeeDetail/EmployeeDetail";
import ConfirmModal from "../../components/ConfirmDelete/ConfirmModal";

import Pagination from "../../components/Pagination";

// Components
import { AlertSuccess, AlertError } from "../../components/Alert";

// Hooks
import { useRequest } from "../../hooks";

// Utils
import { getProfile } from "../../utils/fileHandler";

type DeleteEmployeeResponse = {
  detail: string;
  employee: EmployeeData;
};

type PaginatedEmployeesData = {
  status: string;
  message: string;
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  total_pages: number;
  current_page: number;
  results: EmployeeData[];
};

const Employees = () => {
  const [category, setCategory] = useState("ALL");
  const [isActive, setIsActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { loading, data, setData } = useGet<PaginatedEmployeesData>(
    `/employee/list/?category=${category}&is_active=${isActive}&page=${currentPage}&page_size=${pageSize}`,
  );
  const {
    loading: deleteLoading,
    error,
    errorMessage,
    response,
    handleRequest,
  } = useRequest<DeleteEmployeeResponse, { employee_id: number }>(
    "/employee/list/",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null,
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<EmployeeData | null>(
    null,
  );
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      const updatedData = data?.results.find(
        (item) => item.employee_id === selectedEmployee?.employee_id,
      );
      if (updatedData) {
        setSelectedEmployee(updatedData);
      }
    }
  }, [data, selectedEmployee, isModalOpen]);

  useEffect(() => {
    if (error) {
      setShowDeleteAlert(true);
    }
  }, [error]);

  useEffect(() => {
    if (response) {
      setShowDeleteAlert(true);
      setData((prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          results: prevData.results.filter(
            (item) => item.employee_id !== response.employee.employee_id,
          ),
          count: prevData.count - 1,
        };
      });
    }
  }, [response]);

  const handleOpenModal = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
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
      const employeeToRemoveId = employeeToRemove.employee_id;
      handleRequest({ employee_id: employeeToRemoveId }, { method: "DELETE" });
      handleCloseConfirmModal();
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {loading && <Loading loading={loading} />}
      {deleteLoading && <Loading loading={deleteLoading} />}
      {showDeleteAlert && response && (
        <AlertSuccess
          message={response.detail}
          onClose={() => setShowDeleteAlert(false)}
        />
      )}
      {showDeleteAlert && error && (
        <AlertError
          message={errorMessage}
          onClose={() => setShowDeleteAlert(false)}
        />
      )}
      <Header />
      <main className="mb-4 flex-1">
        <div className="right-2 flex items-center justify-between px-6 py-4">
          <div className="">
            <h2 className="text-xl font-bold text-blue-600">
              CABWAD List of Employees:{" "}
              <span className="text-gray-600">##</span>
            </h2>
          </div>
          {data && (
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
            <div className="mr-4 inline-block">
              <label className="inline-flex cursor-pointer items-center">
                <input
                  onClick={() => setIsActive(!isActive)}
                  type="checkbox"
                  className="peer sr-only"
                />
                <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-blue-600">
                  RESIGNED
                </span>
              </label>
            </div>

            <select
              name="Employment Status"
              title="employment_status"
              defaultValue="ALL"
              onChange={(e) => setCategory(e.target.value)}
              className="rounded border-2 bg-white text-blue-600"
            >
              <option value="ALL">ALL</option>
              <option value="PERMANENT">PERMANENT</option>
              <option value="CASUAL">CASUAL</option>
              <option value="JOB ORDER">JOB ORDER</option>
              <option value="CO-TERMINUS">CO-TERMINUS</option>
              <option value="CONTRACT OF SERVICE">CONTRACT OF SERVICE</option>
              <option value="TEMPORARY">TEMPORARY</option>
            </select>
          </div>
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.results?.map((item) => (
            <div
              key={item.employee_id}
              className="cursor-pointer"
              onClick={() => handleOpenModal(item)}
            >
              <div className="relative flex h-60 w-full flex-col items-center rounded-md bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-600 sm:p-6">
                <button
                  className="absolute top-2 right-2 transform cursor-pointer transition-transform duration-300 hover:scale-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenConfirmModal(item);
                  }}
                >
                  <img src={remove} alt="Remove User" className="w-6" />
                </button>

                <img
                  src={getProfile(item.files) ?? displayPic}
                  alt="Employee Icon"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = displayPic;
                  }}
                  className="mt-4 h-[70px] w-[70px] rounded-[50%] border-2 border-slate-300"
                />
                <div className="flex flex-grow flex-col justify-between text-center">
                  <p className="mt-2 font-bold text-gray-800">{`${item.first_name} ${item.surname}`}</p>
                  <p className="text-sm text-gray-500">{`${item.appointment_status}`}</p>
                  <p className="text-xs text-gray-400">{`${item.department}`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data && (
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
      </main>
      <Footer />
      {selectedEmployee && (
        <EmployeeDetail
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          employee={selectedEmployee}
          setData={setData}
        />
      )}
      {employeeToRemove && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleRemoveEmployee}
          employee={employeeToRemove}
        />
      )}
    </div>
  );
};

export default Employees;
