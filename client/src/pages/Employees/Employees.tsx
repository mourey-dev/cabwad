import { useState } from "react";
import remove from "../../assets/images/remove-user.png";
import displayPic from "../../assets/images/displayPic.png";
import { useGet } from "../../hooks";
import { EmployeesData, EmployeeData } from "../../types/employee";
import { Header, Footer } from "../../components";
import Loading from "../../components/Loading";
import EmployeeDetail from "../../components/EmployeeDetail/EmployeeDetail";

const Employees = () => {
  const [category, setCategory] = useState("ALL");
  const { loading, data } = useGet<EmployeesData>(
    `/employee/list/?category=${category}`,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null,
  );

  const handleOpenModal = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {loading && <Loading loading={loading} />}
      <Header />
      <main className="flex-1">
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-blue-600">
            CABWAD List of Employees: <span className="text-gray-600">##</span>
          </h2>
        </div>
        <div className="absolute top-20 right-2">
          <button className="rounded px-4 py-1 text-blue-600 transition duration-300 hover:border-2 hover:border-blue-600 hover:bg-blue-100">
            Resigned
          </button>

          <select
            name="Employment Status"
            title="employment_status"
            defaultValue="ALL"
            onChange={(e) => setCategory(e.target.value)}
            className="rounded border-2 text-blue-600"
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
        <div className="mb-6 grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.map((item) => (
            <div
              key={item.employee_id}
              className="cursor-pointer"
              onClick={() => handleOpenModal(item)}
            >
              <div className="relative flex w-full flex-col items-center rounded-md bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-600 sm:p-6">
                <button className="absolute top-2 right-2">
                  <img src={remove} alt="Remove User" className="w-6" />
                </button>
                <img
                  src={displayPic}
                  alt="Employee Icon"
                  className="mt-4 w-16"
                />
                <p className="mt-2 text-center font-bold text-gray-800">{`${item.first_name} ${item.surname}`}</p>
                <p className="text-center text-sm text-gray-500">{`${item.position}`}</p>
                <p className="text-center text-xs text-gray-400">{`${item.department}`}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      {selectedEmployee && (
        <EmployeeDetail
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          employee={selectedEmployee}
        />
      )}
    </div>
  );
};

export default Employees;
