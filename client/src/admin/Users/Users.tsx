import { useState } from "react";
import remove from "../../assets/images/remove.png";
import displayPic from "../../assets/images/displayPic.png";
import { Header, Footer, FilterBar, Pagination } from "../../components";
import Loading from "../../components/Loading";
import { ConfirmationModal } from "../../components/Modal";
import add from "../../assets/images/add.png";
import plus from "../../assets/images/plus.png";
import AddUserModal from "./AddUserModal/AddUserModal";
import { AccountType, AccountResponse } from "../../types/account";
import { useGetQuery } from "../../hooks/useCustomQuery";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateAccount,
  useDeleteAccount,
  useToggleAccountStatus,
} from "../../hooks/useAccount";
import { useQueryClient } from "@tanstack/react-query";
import { formatName } from "../../utils/formatters";

// Context
import { useStatus } from "../../context/StatusContext";

// Component
import { AlertSuccess, AlertError } from "../../components/Alert";

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
  const { data, isLoading } = useGetQuery<AccountResponse>(
    [
      userType,
      isActive.toString(),
      currentPage.toString(),
      pageSize.toString(),
    ],
    `/account/list/?user_type=${userType}&is_active=${isActive}&page=${currentPage}&page_size=${pageSize}`,
  );
  const { status, setStatus } = useStatus();
  const confirmationMessage = isActive
    ? "Are you sure you want to delete"
    : "Are you sure you want to return";
  const { mutate: createAccount, isPending: isCreating } = useCreateAccount();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const { mutate: toggleAccountStatus } = useToggleAccountStatus();

  const handleOpenConfirmModal = (account: AccountType) => {
    setAccountToRemove(account);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setAccountToRemove(null);
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
          setStatus({
            ...status,
            success: true,
            message: response.message || "User deactivated successfully",
          });

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
          setStatus({
            ...status,
            success: false,
            message: error.message || "Failed to deactivate user",
          });
          handleCloseConfirmModal();
        },
      });
    }
  };

  const handleAddUser = (userData: Omit<AccountType, "id">) => {
    createAccount(userData, {
      onSuccess: (response) => {
        setIsAddUserModalOpen(false);
        setStatus({
          ...status,
          success: true,
          message: response.message || "User added successfully",
        });

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
        setStatus({
          ...status,
          success: false,
          message: error.message || "Failed to add user",
        });
      },
    });
  };

  const handleToggleUserStatus = () => {
    if (accountToRemove?.id) {
      // Just send the ID and let the server handle the toggling
      toggleAccountStatus(
        { id: accountToRemove.id },
        {
          onSuccess: (response) => {
            handleCloseConfirmModal();

            // Use the response to determine the new status
            const actionText = isActive ? "activated" : "deactivated";
            setStatus({
              ...status,
              success: true,
              message: response.message || `User ${actionText} successfully`,
            });

            // Invalidate queries to refresh the data
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
            setStatus({
              ...status,
              error: true,
              success: false,
              message: error.message || "Failed to update user status",
            });
            handleCloseConfirmModal();
          },
        },
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {(isLoading || isCreating || isDeleting) && (
        <Loading loading={isLoading || isCreating || isDeleting} />
      )}
      <Header />
      {status.success && <AlertSuccess message={status.message} />}
      {status.error && <AlertError message={status.message} />}
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
                  <img
                    src={isActive ? remove : plus}
                    alt="Add/Remove User"
                    className="w-6"
                  />
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
        <ConfirmationModal
          onClose={handleCloseConfirmModal}
          onConfirm={handleToggleUserStatus}
          message={`${confirmationMessage} ${formatName(accountToRemove.first_name, accountToRemove.last_name)}?`}
          isError={isActive}
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
