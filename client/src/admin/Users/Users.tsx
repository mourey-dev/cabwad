import { useState } from "react";
import remove from "../../assets/images/remove-user.png";
import displayPic from "../../assets/images/displayPic.png";
import { Header, Footer, FilterBar, Pagination } from "../../components";
import Loading from "../../components/Loading";
import ConfirmModal from "../../components/ConfirmDelete/ConfirmModal";
import add from "../../assets/images/add.png";
import AddUserModal from "./AddUserModal/AddUserModal";
import { AccountType, AccountResponse } from "../../types/account";
import { useGetQuery } from "../../hooks/useCustomQuery";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateAccount, useDeleteAccount } from "../../hooks/useAccount";
import { useQueryClient } from "@tanstack/react-query";

// Component
import { AlertSuccess } from "../../components/Alert";

const options = ["ALL", "ADMIN", "SUPER ADMIN"];

const Users = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pageNumber } = useParams();
  const [currentPage, setCurrentPage] = useState(Number(pageNumber) || 1);
  const [pageSize, setPageSize] = useState(20);
  const [isActive, setIsActive] = useState(true);
  const [userType, setUserType] = useState("ALL");
  useState<AccountType | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [accountToRemove, setAccountToRemove] = useState<AccountType | null>(
    null,
  );
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { data, isLoading } = useGetQuery<AccountResponse>(
    [
      userType,
      isActive.toString(),
      currentPage.toString(),
      pageSize.toString(),
    ],
    `/account/list/?user_type=${userType}&is_active=${isActive}&page=${currentPage}&page_size=${pageSize}`,
  );

  const { mutate: createAccount, isPending: isCreating } = useCreateAccount();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    navigate(`/admin/users/page/${newPage}`);
  };

  const handleRemoveUser = () => {
    if (accountToRemove?.id) {
      deleteAccount(accountToRemove.id, {
        onSuccess: (response) => {
          handleCloseConfirmModal();
          setAlertMessage(response.message || "User deactivated successfully");
          setShowAlert(true);

          // Invalidate the current query to refresh the list
          queryClient.invalidateQueries({
            queryKey: [
              userType,
              isActive.toString(),
              currentPage.toString(),
              pageSize.toString(),
            ],
          });
        },
        onError: (error) => {
          setAlertMessage(error.message || "Failed to deactivate user");
          setShowAlert(true);
          handleCloseConfirmModal();
        },
      });
    }
  };

  const handleAddUser = (userData: Omit<AccountType, "id">) => {
    createAccount(userData, {
      onSuccess: (response) => {
        setIsAddUserModalOpen(false);
        setAlertMessage(response.message || "User added successfully");
        setShowAlert(true);

        // Match the exact query key structure used in useGetQuery
        queryClient.invalidateQueries({
          queryKey: [
            userType,
            isActive.toString(),
            currentPage.toString(),
            pageSize.toString(),
          ],
        });
      },
      onError: (error) => {
        setAlertMessage(error.message || "Failed to add user");
        setShowAlert(true);
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {isLoading ||
        isCreating ||
        (isDeleting && (
          <Loading loading={isLoading || isCreating || isDeleting} />
        ))}
      <Header />
      {showAlert && (
        <AlertSuccess message={alertMessage} onClose={handleAlertClose} />
      )}
      <main className="flex-1">
        <div className="right-2 flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-bold text-blue-600">
            CABWAD List of Admins:
          </h2>
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
              category={userType}
              onCategoryChange={setUserType}
              isActive={isActive}
              onActiveChange={setIsActive}
              options={options}
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.results?.map((user) => (
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
