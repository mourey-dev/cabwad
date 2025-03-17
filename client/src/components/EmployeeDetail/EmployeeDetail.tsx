import React, { useState, useEffect } from "react";
import Default from "../../assets/images/default.png";
import ViewDocument from "./ViewDocument";
import Close from "../../assets/images/close.png";

import { EmployeeData, FileType, EmployeeFile } from "../../types/employee";

// Components
import EmployeeUpdateModal from "../EmployeeDetail/UpdateDetail/UpdateDetail";
import LoadingModal from "../Loading/Loading";
import { AlertSuccess } from "../Alert";
import { ConfirmationModal } from "../Modal";

// Hooks
import { useRequest } from "../../hooks";

// Utils
import { convertToBase64, getProfile } from "../../utils/fileHandler";

interface EmployeeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeData;
  setData: React.Dispatch<React.SetStateAction<EmployeeData[] | null>>;
}

interface EmployeeFileResponse {
  detail: string;
  employee_file: EmployeeFile;
}

interface EmployeeCreateFileData {
  file_type: string;
  payload: {
    fileName: string;
    fileType: string;
    fileContent: string;
  };
  employee: EmployeeData;
}

interface EmployeeUpdateFileData {
  file_id: string;
  file_type: string;
  payload: {
    fileName: string;
    fileType: string;
    fileContent: string;
  };
  employee: EmployeeData;
}

interface EmployeeDeleteFileData {
  file_id: string;
  employee: EmployeeData;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  isOpen,
  onClose,
  employee,
  setData,
}) => {
  const [isViewDocumentOpen, setIsViewDocumentOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [fileType, setFileType] = useState("");
  const [fileId, setFileId] = useState("");
  const [showPostAlert, setShowPostAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [isUpdateFileModalOpen, setIsUpdateFileModalOpen] = useState(false);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Employee File POST Request
  const {
    loading: employeeFilePostLoading,
    response: employeFilePostResponse,
    handleRequest: handleEmployeeFilePost,
  } = useRequest<EmployeeFileResponse, EmployeeCreateFileData>(
    "/employee/files/",
    {
      method: "POST",
    },
  );

  // Employee File DELETE Request
  const {
    loading: employeeFileDeleteLoading,
    response: employeFileDeleteResponse,
    handleRequest: handleEmployeeFileDelete,
  } = useRequest<EmployeeFileResponse, EmployeeDeleteFileData>(
    "/employee/files/",
    {
      method: "DELETE",
    },
  );

  // Employee File UPDATE Request
  const {
    loading: employeeFileUpdateLoading,
    response: employeFileUpdateResponse,
    handleRequest: handleEmployeeFileUpdate,
  } = useRequest<EmployeeFileResponse, EmployeeUpdateFileData>(
    "/employee/files/",
    {
      method: "PUT",
    },
  );

  useEffect(() => {
    if (employeFilePostResponse) {
      setShowPostAlert(true);
      setData((prev) => {
        if (!prev) return prev;
        return prev.map((emp) =>
          emp.employee_id === employee.employee_id
            ? {
                ...emp,
                files: [...emp.files, employeFilePostResponse.employee_file],
              }
            : emp,
        );
      });
      setFileId(employeFilePostResponse.employee_file.file_id);
    }
  }, [employeFilePostResponse]);

  useEffect(() => {
    if (employeFileDeleteResponse) {
      setShowDeleteAlert(true);
      setData((prev) => {
        if (!prev) return prev;
        return prev.map((emp) =>
          emp.employee_id === employee.employee_id
            ? {
                ...emp,
                files: emp.files.filter(
                  (file) =>
                    file.file_id !==
                    employeFileDeleteResponse.employee_file.file_id,
                ),
              }
            : emp,
        );
      });
    }
  }, [employeFileDeleteResponse]);

  useEffect(() => {
    if (employeFileUpdateResponse) {
      setShowUpdateAlert(true);
      setFileId(employeFileUpdateResponse.employee_file.file_id);
      setSelectedFile(null);
      setData((prev) => {
        if (!prev) return prev;
        return prev.map((emp) =>
          emp.employee_id === employee.employee_id
            ? {
                ...emp,
                files: emp.files.map((file) =>
                  file.name === employeFileUpdateResponse.employee_file.name
                    ? employeFileUpdateResponse.employee_file
                    : file,
                ),
              }
            : emp,
        );
      });
    }
  }, [employeFileUpdateResponse, employee.employee_id]);

  if (!isOpen) return null;

  const toggleDropdown = (
    index: number,
    type: string,
    file_id: string | undefined,
  ) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
    setFileType(type);
    setFileId(file_id || "");
  };

  const handleViewDocument = () => {
    window.open(
      `https://drive.google.com/drive/folders/${employee.folder_id}`,
      "blank",
    );
  };

  const handleViewFile = (file: EmployeeFile | undefined) => {
    if (!file) return;
    window.open(
      `https://drive.google.com/file/d/${file.file_id}/view`,
      "blank",
    );
  };

  const handleAddFile = () => {
    setIsAddFileModalOpen(true);
  };

  const handleDeleteFile = () => {
    setIsConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    handleEmployeeFileDelete({ file_id: fileId, employee });
    setIsConfirmationModalOpen(false);
  };

  const handleUpdateFile = async (file: File) => {
    const base64 = await convertToBase64(file);
    const payload = {
      fileName: file.name,
      fileType: file.type,
      fileContent: base64,
    };

    await handleEmployeeFileUpdate({
      file_id: fileId,
      file_type: fileType,
      payload,
      employee,
    });
    setIsUpdateFileModalOpen(false);
  };

  const handleUploadFile = async () => {
    if (selectedFile) {
      const base64 = await convertToBase64(selectedFile);
      const payload = {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileContent: base64,
      };

      await handleEmployeeFilePost({
        file_type: fileType,
        payload,
        employee,
      });
      setIsAddFileModalOpen(false);
      setSelectedFile(null);
    }
  };

  const documents = Object.entries(FileType).map(([key, value]) => ({
    key,
    label: value,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 p-4">
      {showDeleteAlert && employeFileDeleteResponse && (
        <AlertSuccess
          message={employeFileDeleteResponse.detail}
          onClose={() => setShowDeleteAlert(false)}
        />
      )}
      {showPostAlert && employeFilePostResponse && (
        <AlertSuccess
          message={employeFilePostResponse.detail}
          onClose={() => setShowPostAlert(false)}
        />
      )}
      {showUpdateAlert && employeFileUpdateResponse && (
        <AlertSuccess
          message={employeFileUpdateResponse.detail}
          onClose={() => setShowUpdateAlert(false)}
        />
      )}
      {employeeFileDeleteLoading && (
        <LoadingModal loading={employeeFileDeleteLoading} />
      )}
      {employeeFilePostLoading && (
        <LoadingModal loading={employeeFilePostLoading} />
      )}
      {employeeFileUpdateLoading && (
        <LoadingModal loading={employeeFileUpdateLoading} />
      )}
      <div className="relative flex w-[1200px] flex-col rounded-lg bg-white p-6 shadow-xl">
        <button
          type="button"
          title="Close Modal"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer px-3 py-1 text-white"
        >
          <img src={Close} alt="" className="h-8 w-8" />
        </button>
        <h2 className="font-jost text-center text-2xl font-bold">
          PERSONAL INFORMATION
        </h2>
        <div className="flex flex-col items-center bg-blue-500">
          <div className="mt-5 mb-5 flex h-45 w-45 items-center justify-center overflow-hidden border bg-white">
            <img
              src={getProfile(employee.files) ?? Default}
              alt="Profile"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = Default;
              }}
            />
          </div>
        </div>

        <div className="flex">
          <div className="w-1/2">
            <div className="font-jost mt-4 space-y-2 text-sm">
              <h3 className="font-bold uppercase">Employee Details</h3>
              <p className="text-gray-800 uppercase">
                ID NO.: {employee.employee_id || "NONE"}
              </p>
              <p className="text-gray-800 uppercase">
                LAST NAME: {`${employee.surname || "NONE"}`}
              </p>
              <p className="text-gray-800 uppercase">
                FIRST NAME:{`${employee.first_name || "NONE"}`}
              </p>
              <p className="text-gray-800 uppercase">
                MIDDLE NAME: {employee.middle_name || "NONE"}
              </p>
              <p className="text-gray-800 uppercase">
                SEX: {employee.sex || "NONE"}
              </p>
              <p className="text-gray-800 uppercase">
                CIVIL STATUS: {employee.civil_status || "NONE"}
              </p>

              <h3 className="mt-4 font-bold uppercase">Contact</h3>
              <p className="text-gray-800 uppercase">
                PHONE NO.: {employee.phone || "NONE"}
              </p>
              <p className="text-gray-800 uppercase">
                EMAIL: {employee.email || "NONE"}
              </p>
            </div>
          </div>

          <div className="font-jost mt-2 w-1/2 space-y-2 text-sm uppercase">
            <h3 className="mt-2 font-bold uppercase">Employment Details</h3>
            <p className="text-gray-800">
              APPOINTMENT STATUS: {employee.appointment_status || "NONE"}
            </p>
            <p className="text-gray-800 uppercase">
              CIVIL SERVICE ELIGIBILITY: {employee.civil_service || "NONE"}
            </p>
            <p className="text-gray-800 uppercase">
              POSITION: {employee.position || "NONE"}
            </p>
            <p className="text-gray-800 uppercase">
              DATE OF BIRTH: {employee.birth_date || "NONE"}
            </p>
            <p className="text-gray-800 uppercase">
              FIRST DAY OF SERVICE: {employee.first_day_service || "NONE"}
            </p>
          </div>

          <div className="mr-auto w-4/5">
            <h3 className="font-jost mt-2 font-bold">Documents</h3>
            <div className="font-jost grid grid-cols-2 text-sm">
              {documents.map((doc, index) => {
                const fileExists: EmployeeFile | undefined =
                  employee.files.find((file) => file.file_type == doc.key);
                return (
                  <div
                    key={index}
                    className="relative cursor-pointer hover:underline"
                  >
                    <div
                      onClick={() =>
                        toggleDropdown(index, doc.key, fileExists?.file_id)
                      }
                      className={`select-none ${fileExists ? "text-green-500" : "text-red-500"} uppercase`}
                    >
                      {doc.label}
                    </div>
                    {dropdownOpen === index && (
                      <div className="absolute left-0 z-100 mt-1 w-32 rounded-md bg-white shadow-lg">
                        <button
                          onClick={handleAddFile}
                          className={`block w-full px-4 py-2 text-left text-sm uppercase hover:bg-gray-300 ${!fileExists ? "" : "disabled:opacity-50"}`}
                          disabled={!!fileExists}
                        >
                          Insert
                        </button>
                        <button
                          onClick={() => handleViewFile(fileExists)}
                          className={`block w-full px-4 py-2 text-left text-sm uppercase hover:bg-gray-300 ${fileExists ? "" : "disabled:opacity-50"}`}
                          disabled={!fileExists}
                        >
                          View
                        </button>
                        <button
                          onClick={() => setIsUpdateFileModalOpen(true)}
                          disabled={!fileExists}
                          className={`block w-full px-4 py-2 text-left text-sm uppercase hover:bg-gray-300 ${fileExists ? "" : "disabled:opacity-50"}`}
                        >
                          Update
                        </button>
                        <button
                          onClick={handleDeleteFile}
                          disabled={!fileExists}
                          className={`block w-full px-4 py-2 text-left text-sm uppercase hover:bg-red-200 ${fileExists ? "" : "disabled:opacity-50"}`}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            className="font-jost flex items-center rounded-full bg-yellow-500 px-6 py-2 text-white uppercase shadow-md transition hover:bg-yellow-600"
            onClick={() => setIsUpdateModalOpen(true)} // Open update modal
          >
            Update
          </button>
          <button
            className="font-jost flex items-center rounded-full bg-blue-500 px-6 py-2 text-white uppercase shadow-md transition hover:bg-blue-600"
            onClick={handleViewDocument}
          >
            View Documents
          </button>
        </div>
      </div>

      {isViewDocumentOpen && (
        <ViewDocument
          isOpen={isViewDocumentOpen}
          onClose={() => setIsViewDocumentOpen(false)}
          employee={null}
        />
      )}

      {/* {isUpdateModalOpen && (
        <EmployeeUpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          employee={employee}
        />
      )} */}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this file? This action cannot be undone."
      />

      {isUpdateFileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Update File</h2>
              <button
                title="Close Modal"
                type="button"
                onClick={() => setIsUpdateFileModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <input
              title="Select File"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file); // Add this state
                }
              }}
              className="mt-4 w-full rounded border p-2"
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsUpdateFileModalOpen(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedFile && handleUpdateFile(selectedFile)}
                disabled={!selectedFile}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddFileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add New File</h2>
              <button
                title="Close Modal"
                type="button"
                onClick={() => setIsAddFileModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <input
              title="Select File"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
              className="mt-4 w-full rounded border p-2"
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsAddFileModalOpen(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadFile}
                disabled={!selectedFile}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
