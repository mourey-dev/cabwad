import { useEffect, useState } from "react";
import remove from "../../assets/images/remove-user.png";
import displayPic from "../../assets/images/displayPic.png";
import { Header, Footer } from "../../components";
import Loading from "../../components/Loading";
import ConfirmModal from "../../components/ConfirmDelete/ConfirmModal";
import add from "../../assets/images/add.png";
import AddUserModal from "./AddUserModal/AddUserModal";
import { useRequest } from "../../hooks";
import { AccountType } from "../../types/account";

// Component
import { AlertSuccess } from "../../components/Alert";

type AccountResponse = {
  status: string;
  message: string;
  data: AccountType[] | AccountType;
};

const Users = () => {
  const [users, setUsers] = useState<AccountType[]>([]);
  useState<AccountType | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [accountToRemove, setAccountToRemove] = useState<AccountType | null>(
    null,
  );
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { loading, error, response, setResponse, handleRequest } =
    useRequest<AccountResponse>("account/api/");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await handleRequest();
      setUsers(response.data as AccountType[]);
    };
    fetchUsers();
  }, []);

  const handleOpenConfirmModal = (account: AccountType) => {
    setAccountToRemove(account);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setAccountToRemove(null);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const handleRemoveUser = () => {
    if (accountToRemove) {
      handleRequest(
        { id: accountToRemove.id },
        {
          method: "DELETE",
        },
      );
      setUsers(users.filter((user) => user.id !== accountToRemove.id));
      setAccountToRemove(null);
      handleCloseConfirmModal();
      setAlertMessage("User deactivated successfully");
      setShowAlert(true);
    }
  };

  const handleAddUser = async (user: AccountType) => {
    const response = await handleRequest(user, { method: "POST" });
    setUsers([...users, response.data as AccountType]);
    setIsAddUserModalOpen(false);
    setAlertMessage("User added successfully");
    setShowAlert(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {loading && <Loading loading={loading} />}
      <Header />
      {showAlert && (
        <AlertSuccess message={alertMessage} onClose={handleAlertClose} />
      )}
      <main className="flex-1">
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-blue-600">
            CABWAD List of Admins:
          </h2>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {users.map((user) => (
            <div key={user.id} className="cursor-pointer">
              <div className="relative flex h-50 w-full flex-col items-center rounded-md bg-white p-4 shadow-md transition-transform duration-300 hover:scale-105 hover:bg-blue-600 sm:p-6">
                <button
                  className="absolute top-2 right-2 transform cursor-pointer transition-transform duration-300 hover:scale-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenConfirmModal(user);
                  }}
                >
                  <img src={remove} alt="Remove User" className="w-6" />
                </button>
                <img src={displayPic} alt="User Icon" className="mt-4 w-16" />
                <div className="flex flex-grow flex-col justify-between text-center">
                  <p className="mt-2 font-bold text-gray-800">
                    {`${user.first_name} ${user.last_name}`}
                  </p>
                  <p className="text-sm text-gray-500">{user.user_type}</p>
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
      {accountToRemove && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleRemoveUser}
          employee={{
            first_name: accountToRemove.first_name,
            surname: accountToRemove.last_name,
          }}
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

export default Users;
