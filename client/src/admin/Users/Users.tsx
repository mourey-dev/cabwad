import { useEffect, useState } from "react";
import remove from "../../assets/images/remove-user.png";
import displayPic from "../../assets/images/displayPic.png";
import { useGet } from "../../hooks";
import { EmployeesData, EmployeeData } from "../../types/employee";
import { Header, Footer } from "../../components";
import Loading from "../../components/Loading";
import EmployeeDetail from "../../components/EmployeeDetail/EmployeeDetail";
import ConfirmModal from "../../components/ConfirmDelete/ConfirmModal";
import add from "../../assets/images/add.png";
import AddUserModal from "../../admin/Users/AddUserModal/AddUserModal";

const Employees = () => {
  const [category, setCategory] = useState("ALL");
  const { loading, data, setData } = useGet<EmployeesData>(
    `/employee/list/?category=${category}`,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(
    null,
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<EmployeeData | null>(
    null,
  );
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      const updatedData = data?.find(
        (item) => item.employee_id === selectedEmployee?.employee_id,
      );
      if (updatedData) {
        setSelectedEmployee(updatedData);
      }
    }
  }, [data, selectedEmployee, isModalOpen]);

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
      setData((prevData) =>
        (prevData ?? []).filter(
          (item) => item.employee_id !== employeeToRemove.employee_id,
        ),
      );
      handleCloseConfirmModal();
    }
  };

  const handleAddUser = (user: {
    firstName: string;
    lastName: string;
    email: string;
    birthdate: string;
    userType: string;
  }) => {
    const newUser: EmployeeData = {
      employee_id: Date.now().toString(),
      name: `${user.firstName} ${user.lastName}`,
      username: user.email,
      birthdate: new Date(user.birthdate),
      userType: user.userType,
    };
    setData((prevData) => [...(prevData ?? []), newUser]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {loading && <Loading loading={loading} />}
      <Header />
      <main className="flex-1">
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-blue-600">
            CABWAD List of Admins:
          </h2>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.map((item) => (
            <div
              key={item.employee_id}
              className="cursor-pointer"
              onClick={() => handleOpenModal(item)}
            >
              <div className="relative flex h-50 w-full flex-col items-center rounded-md bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-600 sm:p-6">
                <button
                  className="absolute top-2 right-2 cursor-pointer rounded-full p-1 hover:bg-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenConfirmModal(item);
                  }}
                >
                  <img src={remove} alt="Remove User" className="w-6" />
                </button>
                <img
                  src={displayPic}
                  alt="Employee Icon"
                  className="mt-4 w-16"
                />
                <div className="flex flex-grow flex-col justify-between text-center">
                  <p className="mt-2 font-bold text-gray-800">User Name</p>
                  <p className="text-sm text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="text-md font-jost fixed right-10 bottom-20 flex cursor-pointer items-center rounded-full bg-green-500 px-6 py-3 text-white shadow-lg hover:bg-green-700"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          <img src={add} alt="" className="h-7 w-7" /> ADD USER
        </button>
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
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  );
};

export default Employees;
