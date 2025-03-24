import { useNavigate, useParams } from "react-router-dom";
import { useEmployeeData } from "../../hooks/useEmployee";

// Hooks
import { useState } from "react";

// Components
import {
  Header,
  Footer,
  Loading,
  BackButton,
  ProfileHeader,
  Requirement,
} from "../../components";

import { getValidDisplay } from "../../utils/dataHandler";

// Types
import { EmployeeFile, FileType } from "../../types/employee";

// Utils
import { getAge } from "../../utils/dataHandler";

const EmployeePersonalDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { employee, isLoading, isError, error } = useEmployeeData(id);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const [fileType, setFileType] = useState("");
  const [fileId, setFileId] = useState("");

  if (isLoading || !employee) {
    return <Loading loading={true} />;
  }

  const resetDropdown = () => {
    setDropdown(null);
    setFileId("");
    setFileType("");
  };

  const toggleDropdown = (
    index: number,
    type: string,
    file_id: string | undefined,
  ) => {
    setDropdown(dropdown === index ? null : index);
    setFileType(type);
    setFileId(file_id || "");
  };

  const documents = Object.entries(FileType).map(([key, value]) => ({
    key,
    label: value,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-blue-600">
      <Header />
      <main className="flex-1 px-6 py-4">
        <div className="max-w-8xl mx-auto rounded-lg bg-white p-8 shadow-md">
          <BackButton onClick={() => navigate(-1)} />
          <ProfileHeader employee={employee} />

          <div className="bg-gray-200 p-3 text-lg font-bold">
            PERSONAL INFORMATION
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            <div className="text-xs/1 text-gray-500">
              SEX:
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.sex)}</strong>
              </p>
            </div>
            <div className="text-xs/1 text-gray-500">
              DATE OF BIRTH:{" "}
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.birth_date)}</strong>
              </p>
            </div>
            <div className="text-xs/1 text-gray-500">
              AGE:
              <p className="text-lg text-black">
                <strong>{getAge(employee.birth_date)}</strong>
              </p>
            </div>
            <div className="text-xs/1 text-gray-500">
              ADDRESS:
              <p className="text-lg text-black">
                <strong>{employee.address}</strong>
              </p>
            </div>
            <div className="text-xs/1 text-gray-500">
              EMPLOYMENT STATUS:{" "}
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.appointment_status)}</strong>
              </p>
            </div>
            <div className="text-xs/1 text-gray-500">
              FIRST DAY OF SERVICE:{" "}
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.first_day_service)}</strong>
              </p>
            </div>
            <div className="text-xs/1 text-gray-500">
              CIVIL STATUS:{" "}
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.civil_status)}</strong>
              </p>
            </div>
            <div className="text-xs/1 text-gray-500">
              CIVIL SERVICE ELIGIBILITY:{" "}
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.civil_service)}</strong>
              </p>
            </div>
          </div>

          <div className="bg-gray-200 p-3 text-lg font-bold uppercase">
            Requirements
          </div>
          <div className="grid grid-cols-5 gap-4 p-6 text-sm">
            {documents.map((doc, index) => {
              const fileExists: EmployeeFile | undefined = employee.files.find(
                (file) => file.file_type == doc.key,
              );

              return (
                <Requirement
                  index={index}
                  document={doc}
                  employeeFile={fileExists}
                  dropdown={dropdown}
                  toggleDropdown={toggleDropdown}
                  key={index}
                  fileId={fileId}
                  fileType={fileType}
                  employee={employee}
                  resetDropdown={resetDropdown}
                />
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmployeePersonalDetails;
