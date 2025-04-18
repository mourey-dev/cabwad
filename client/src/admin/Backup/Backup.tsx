import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBackups,
  createBackup,
  deleteBackup,
  downloadBackup,
  executeBackupOperation,
} from "../../api/backup";
import { formatDate, formatDuration } from "../../utils/formatters";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";
import BackupModal from "../../components/Modal/BackupModal";
import { Header, Footer } from "../../components";
import { AlertSuccess, AlertError } from "../../components/Alert";
import { useStatus } from "../../context/StatusContext";
import {
  FaDownload,
  FaTrash,
  FaCloudUploadAlt,
  FaPlus,
  FaHistory,
  FaExclamationTriangle,
  FaCloudDownloadAlt,
  FaBroom,
} from "react-icons/fa";

const Backup: React.FC = () => {
  const queryClient = useQueryClient();
  const { status } = useStatus();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCleanupModalOpen, setIsCleanupModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<any>(null);
  const [cleanupDays, setCleanupDays] = useState(30);

  // Form state for create backup
  const [backupOptions, setBackupOptions] = useState({
    compress: true,
    upload_drive: false,
    monthly_folders: true,
  });

  // Form state for restore backup
  const [restoreOptions, setRestoreOptions] = useState({
    backup_id: null,
    destination: "same",
    new_database_name: "",
  });

  // Query backups
  const {
    data: backups,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["backups"],
    queryFn: fetchBackups,
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: createBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      toast.success("Backup created successfully");
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to create backup: ${error.message}`);
    },
  });

  // Delete backup mutation
  const deleteBackupMutation = useMutation({
    mutationFn: deleteBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      toast.success("Backup deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedBackup(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete backup: ${error.message}`);
    },
  });

  // Execute backup operation mutation
  const executeOperationMutation = useMutation({
    mutationFn: executeBackupOperation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      toast.success("Operation completed successfully");
      setIsCleanupModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Operation failed: ${error.message}`);
    },
  });

  // Restore backup mutation
  const restoreBackupMutation = useMutation({
    mutationFn: (options: {
      backup_id: string | null;
      destination: string;
      new_database_name: string;
    }) =>
      executeBackupOperation({
        operation: "restore",
        parameters: options,
      }),
  });

  // Handle creating a new backup
  const handleCreateBackup = () => {
    createBackupMutation.mutate(backupOptions);
  };

  // Handle deleting a backup
  const handleDeleteBackup = () => {
    if (selectedBackup) {
      deleteBackupMutation.mutate({
        id: selectedBackup.id,
        deleteFile: true,
      });
    }
  };

  // Handle downloading a backup
  const handleDownloadBackup = (backup: any) => {
    downloadBackup(backup.id)
      .then(() => {
        toast.success("Download started");
      })
      .catch((error) => {
        toast.error(`Download failed: ${error.message}`);
      });
  };

  // Handle cleanup operation
  const handleCleanup = () => {
    executeOperationMutation.mutate({
      operation: "cleanup",
      parameters: {
        days: cleanupDays,
      },
    });
  };

  // Handle restore operation
  const handleRestore = () => {
    restoreBackupMutation.mutate(restoreOptions, {
      onSuccess: (data) => {
        toast.success(
          `Database restored successfully to ${data.target_database}`,
        );
        setIsRestoreModalOpen(false);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Unknown error restoring database";
        toast.error(errorMessage);
        console.error("Restore error details:", error);
      },
    });
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    let bgColor;
    let textColor = "text-white";

    switch (status) {
      case "success":
        bgColor = "bg-green-600";
        break;
      case "failed":
        bgColor = "bg-red-600";
        break;
      case "in_progress":
        bgColor = "bg-blue-500";
        break;
      default:
        bgColor = "bg-gray-500";
    }

    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${bgColor} ${textColor}`}
      >
        {status}
      </span>
    );
  };

  // Render storage location badge
  const renderStorageBadge = (location: string) => {
    let bgColor;
    let textColor = "text-white";
    let icon;

    switch (location) {
      case "local":
        bgColor = "bg-indigo-600";
        icon = <FaDownload className="mr-1" />;
        break;
      case "google_drive":
        bgColor = "bg-blue-500";
        icon = <FaCloudUploadAlt className="mr-1" />;
        break;
      case "both":
        bgColor = "bg-purple-600";
        icon = <FaCloudDownloadAlt className="mr-1" />;
        break;
      default:
        bgColor = "bg-gray-500";
        icon = null;
    }

    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${bgColor} ${textColor} flex items-center`}
      >
        {icon}
        {location}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen flex-col text-white">
      {isLoading && <Loading loading={isLoading} />}
      {status.success && <AlertSuccess message={status.message} />}
      {status.error && <AlertError message={status.message} />}
      <Header />

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-start bg-[url(/src/assets/images/logo-bg.png)] bg-cover bg-center bg-no-repeat p-8">
        <div className="w-full max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Database Backups</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCleanupModalOpen(true)}
                className="flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none"
              >
                <FaBroom className="mr-2" />
                Cleanup Old Backups
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                <FaPlus className="mr-2" />
                Create Backup
              </button>
            </div>
          </div>

          {isError ? (
            <div className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong className="font-bold">Error loading backups: </strong>
              <span className="block sm:inline">{(error as any)?.message}</span>
            </div>
          ) : backups?.length === 0 ? (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-8 text-center text-yellow-800">
              <FaExclamationTriangle className="mx-auto mb-4 text-4xl text-yellow-500" />
              <h3 className="text-lg font-medium">No backups found</h3>
              <p className="mt-2 text-yellow-600">
                Create your first database backup by clicking the 'Create
                Backup' button above.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-lg bg-white shadow-md">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          Backup Details
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          Date & Retention
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          Storage
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {backups?.map((backup: any) => (
                        <tr key={backup.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">
                                {backup.filename}
                              </div>
                              <div className="text-sm text-gray-500">
                                {backup.formatted_size || "Unknown size"}
                                {backup.is_compressed && (
                                  <span className="ml-2 text-xs font-medium text-blue-600">
                                    Compressed
                                  </span>
                                )}
                              </div>
                              {backup.execution_time_seconds && (
                                <div className="text-xs text-gray-400">
                                  Created in{" "}
                                  {formatDuration(
                                    backup.execution_time_seconds,
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(backup.created_at)}
                            </div>
                            {backup.days_until_deletion !== null ? (
                              <div
                                className={`text-xs ${
                                  backup.days_until_deletion < 5
                                    ? "text-red-500"
                                    : "text-gray-500"
                                }`}
                              >
                                {backup.days_until_deletion === 0
                                  ? "Scheduled for deletion today"
                                  : `${backup.days_until_deletion} days until deletion`}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-500">
                                No deletion scheduled
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStatusBadge(backup.status)}
                            {backup.error_message && (
                              <div className="mt-1 max-w-xs truncate text-xs text-red-500">
                                {backup.error_message}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStorageBadge(backup.storage_location)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                            <div className="flex justify-end space-x-2">
                              {backup.is_local_available && (
                                <button
                                  onClick={() => handleDownloadBackup(backup)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Download backup"
                                >
                                  <FaDownload />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedBackup(backup);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Delete backup"
                              >
                                <FaTrash />
                              </button>
                              <button
                                onClick={() => {
                                  setRestoreOptions({
                                    ...restoreOptions,
                                    backup_id: backup.id,
                                  });
                                  setIsRestoreModalOpen(true);
                                }}
                                className="mx-2 text-green-600 hover:text-green-900"
                                title="Restore backup"
                              >
                                🔄
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 text-sm">
                <p>
                  <FaHistory className="mr-2 inline" />
                  Showing {backups?.length} backup records. Automatic cleanup
                  occurs after the retention period ends.
                </p>
              </div>
            </>
          )}

          {/* Create Backup Modal */}
          <BackupModal
            isOpen={isCreateModalOpen}
            title="Create New Backup"
            onClose={() => setIsCreateModalOpen(false)}
            onConfirm={handleCreateBackup}
            confirmText={
              createBackupMutation.isPending ? "Creating..." : "Create Backup"
            }
            confirmDisabled={createBackupMutation.isPending}
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Create a new backup of your database. This process might take a
                few moments depending on the size of your database.
              </p>

              <div className="flex items-center">
                <input
                  id="compress"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={backupOptions.compress}
                  onChange={(e) =>
                    setBackupOptions({
                      ...backupOptions,
                      compress: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="compress"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Compress backup (recommended)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="upload_drive"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={backupOptions.upload_drive}
                  onChange={(e) =>
                    setBackupOptions({
                      ...backupOptions,
                      upload_drive: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="upload_drive"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Upload to Google Drive
                </label>
              </div>

              {backupOptions.upload_drive && (
                <div className="ml-6 flex items-center">
                  <input
                    id="monthly_folders"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={backupOptions.monthly_folders}
                    onChange={(e) =>
                      setBackupOptions({
                        ...backupOptions,
                        monthly_folders: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="monthly_folders"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Organize in monthly folders
                  </label>
                </div>
              )}

              {createBackupMutation.isPending && (
                <div className="flex items-center justify-center">
                  <Loading loading={true} />
                </div>
              )}
            </div>
          </BackupModal>

          {/* Delete Backup Modal */}
          <BackupModal
            isOpen={isDeleteModalOpen}
            title="Delete Backup"
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedBackup(null);
            }}
            onConfirm={handleDeleteBackup}
            confirmText={
              deleteBackupMutation.isPending ? "Deleting..." : "Delete Backup"
            }
            confirmDisabled={deleteBackupMutation.isPending}
            confirmStyle="danger"
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this backup? This action cannot
                be undone.
              </p>
              {selectedBackup && (
                <div className="rounded-md bg-gray-50 p-3">
                  <p className="text-sm font-medium">
                    {selectedBackup.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created on {formatDate(selectedBackup.created_at)}
                  </p>
                </div>
              )}
              {deleteBackupMutation.isPending && <Loading loading={true} />}
            </div>
          </BackupModal>

          {/* Cleanup Modal */}
          <BackupModal
            isOpen={isCleanupModalOpen}
            title="Cleanup Old Backups"
            onClose={() => setIsCleanupModalOpen(false)}
            onConfirm={handleCleanup}
            confirmText={
              executeOperationMutation.isPending ? "Cleaning..." : "Cleanup"
            }
            confirmDisabled={executeOperationMutation.isPending}
            confirmStyle="warning"
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                This will permanently delete all backups older than the
                specified number of days. This action cannot be undone.
              </p>

              <div>
                <label
                  htmlFor="cleanup_days"
                  className="block text-sm font-medium text-gray-700"
                >
                  Delete backups older than (days)
                </label>
                <input
                  type="number"
                  id="cleanup_days"
                  className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  min="1"
                  value={cleanupDays}
                  onChange={(e) => setCleanupDays(parseInt(e.target.value))}
                />
              </div>

              {executeOperationMutation.isPending && <Loading loading={true} />}
            </div>
          </BackupModal>

          {/* Restore Modal */}
          <BackupModal
            isOpen={isRestoreModalOpen}
            title="Restore Database"
            onClose={() => setIsRestoreModalOpen(false)}
            onConfirm={handleRestore}
            confirmText={
              restoreBackupMutation.isPending
                ? "Restoring..."
                : "Restore Database"
            }
            confirmDisabled={
              restoreBackupMutation.isPending ||
              (restoreOptions.destination === "new" &&
                !restoreOptions.new_database_name)
            }
            confirmStyle="warning"
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Restore a database from the selected backup. This will overwrite
                the destination database.
              </p>

              {selectedBackup && (
                <div className="rounded-md bg-blue-50 p-3">
                  <p className="text-sm font-medium">
                    Restore from: {selectedBackup.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created on {formatDate(selectedBackup.created_at)}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Restore destination
                </label>
                <div className="mt-1">
                  <div className="mb-2 flex items-center">
                    <input
                      id="restore-same"
                      name="restore-destination"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={restoreOptions.destination === "same"}
                      onChange={() =>
                        setRestoreOptions({
                          ...restoreOptions,
                          destination: "same",
                        })
                      }
                    />
                    <label
                      htmlFor="restore-same"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Same database ({selectedBackup?.database_name})
                    </label>
                  </div>

                  <div className="mb-2 flex items-center">
                    <input
                      id="restore-new"
                      name="restore-destination"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={restoreOptions.destination === "new"}
                      onChange={() =>
                        setRestoreOptions({
                          ...restoreOptions,
                          destination: "new",
                        })
                      }
                    />
                    <label
                      htmlFor="restore-new"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      New database
                    </label>
                  </div>

                  {restoreOptions.destination === "new" && (
                    <div className="mt-2 ml-6">
                      <label
                        htmlFor="new-db-name"
                        className="block text-xs font-medium text-gray-700"
                      >
                        New database name
                      </label>
                      <input
                        type="text"
                        id="new-db-name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={restoreOptions.new_database_name}
                        onChange={(e) =>
                          setRestoreOptions({
                            ...restoreOptions,
                            new_database_name: e.target.value,
                          })
                        }
                        placeholder="Enter new database name"
                      />
                    </div>
                  )}

                  <div className="mt-2 flex items-center">
                    <input
                      id="restore-other"
                      name="restore-destination"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={
                        restoreOptions.destination !== "same" &&
                        restoreOptions.destination !== "new"
                      }
                      onChange={() =>
                        setRestoreOptions({
                          ...restoreOptions,
                          destination: "",
                        })
                      }
                    />
                    <label
                      htmlFor="restore-other"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Different existing database
                    </label>
                  </div>

                  {restoreOptions.destination !== "same" &&
                    restoreOptions.destination !== "new" && (
                      <div className="mt-2 ml-6">
                        <label
                          htmlFor="existing-db-name"
                          className="block text-xs font-medium text-gray-700"
                        >
                          Database name
                        </label>
                        <input
                          type="text"
                          id="existing-db-name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={restoreOptions.destination}
                          onChange={(e) =>
                            setRestoreOptions({
                              ...restoreOptions,
                              destination: e.target.value,
                            })
                          }
                          placeholder="Enter database name"
                        />
                      </div>
                    )}
                </div>
              </div>

              <div className="mt-4 rounded-md border border-yellow-100 bg-yellow-50 p-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">⚠️</div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Warning: Restoring will overwrite the destination
                      database. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              {restoreBackupMutation.isPending && <Loading loading={true} />}
            </div>
          </BackupModal>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Backup;
