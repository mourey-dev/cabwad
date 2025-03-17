import { useNavigate, useParams } from "react-router-dom";
import { useEmployeeData } from "../../hooks/useEmployee";

// Components
import { Header, Footer, Loading } from "../../components";

// Assets
import Phone from "../../assets/images/contact-phone.png";
import Email from "../../assets/images/contact-email.png";
import back from "../../assets/images/back.png";
import Default from "../../assets/images/default.png";

// Utils
import { getProfile } from "../../utils/fileHandler";

const getValidDisplay = (value: string, defaultValue: string = "NONE") => {
  return value.length === 0 ? defaultValue : value;
};

const getAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const EmployeePersonalDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { employee, isLoading, isError, error } = useEmployeeData(id);

  if (isLoading || !employee) {
    return <Loading loading={true} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-blue-600">
      <Header />
      <main className="flex-1 px-6 py-4">
        <div className="max-w-8xl mx-auto rounded-lg bg-white p-8 shadow-md">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <img
              src={back}
              alt="Back"
              className="h-5 w-5 transition-transform duration-300 hover:scale-120"
            />
            <span className="text-md font-medium">Back</span>
          </button>

          <div className="mb-4 flex items-center border-b pb-4">
            <img
              src={getProfile(employee.files) ?? Default}
              alt="Profile"
              className="h-32 w-32 object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = Default;
              }}
            />
            <div className="ml-6">
              <h2 className="text-3xl font-bold">{`${employee.first_name} ${employee.surname}`}</h2>
              <p className="text-gray-600">{`#${employee.employee_id}`}</p>
              <div className="mt-2 flex items-center space-x-4">
                <span className="text-blue flex items-center gap-2">
                  <img src={Phone} alt="Phone" className="h-4 w-4" />
                  {getValidDisplay(employee.phone)}
                </span>
                <span className="text-blue flex items-center gap-2">
                  <img src={Email} alt="Email" className="h-4 w-4" />
                  {getValidDisplay(employee.email)}
                </span>
              </div>
              <div className="mt-3 flex space-x-3">
                <button className="rounded bg-green-500 px-5 py-2 text-white hover:bg-green-600">
                  Update Info
                </button>
                <button className="rounded bg-blue-500 px-5 py-2 text-white hover:bg-blue-600">
                  Upload Profile Image
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-200 p-3 text-lg font-bold">
            PERSONAL INFORMATION
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            <p className="text-xs/1 text-gray-500">
              SEX:
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.sex)}</strong>
              </p>
            </p>
            <p className="text-xs/1 text-gray-500">
              DATE OF BIRTH:{" "}
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.birth_date)}</strong>
              </p>
            </p>
            <p className="text-xs/1 text-gray-500">
              AGE:
              <p className="text-lg text-black">
                <strong>{getAge(employee.birth_date)}</strong>
              </p>
            </p>
            <p className="text-xs/1 text-gray-500">
              ADDRESS:
              <p className="text-lg text-black">
                <strong>NONE</strong>
              </p>
            </p>
            <p className="text-xs/1 text-gray-500">
              EMPLOYMENT STATUS:{" "}
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.appointment_status)}</strong>
              </p>
            </p>
            <p className="text-xs/1 text-gray-500">
              FIRST DAY OF SERVICE:{" "}
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.first_day_service)}</strong>
              </p>
            </p>
            <p className="text-xs/1 text-gray-500">
              CIVIL STATUS:{" "}
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.civil_status)}</strong>
              </p>
            </p>
            <p className="text-xs/1 text-gray-500">
              CIVIL SERVICE ELIGIBILITY:{" "}
              <p className="text-lg text-black">
                <strong>{getValidDisplay(employee.civil_service)}</strong>
              </p>
            </p>
          </div>

          <div className="bg-gray-200 p-3 text-lg font-bold">Requirements</div>
          <div className="grid grid-cols-5 gap-4 p-6 text-sm">
            <p>Certificate of CSC Eligibility</p>
            <p>Form 137</p>
            <p>Notice of Salary Adjustment / Step Increment</p>
            <p>Marriage Contract</p>
            <p>Driver's License (Photocopy)</p>
            <p>Position Description Forms</p>
            <p>NBI Clearance</p>
            <p>Training Certificate</p>
            <p>Pag-IBIG</p>
            <p>Birth Certificate</p>
            <p>Assumption of Duty</p>
            <p>TIN No.</p>
            <p>Birth Certificate of Child/Ren</p>
            <p>Contract of Services</p>
            <p>Diplomas, Commendations, and Awards</p>
            <p>Marriage Certificate</p>
            <p>Personal Data Sheet</p>
            <p>Appointments</p>
            <p>PRC License (Photocopy)</p>
            <p>Certificate of Leave Balances</p>
            <p>Copies of Disciplinary Actions</p>
            <p>Oath of Office</p>
            <p>Transcript of Records</p>
            <p>Form 138-A</p>
            <p>PhilHealth</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmployeePersonalDetails;
