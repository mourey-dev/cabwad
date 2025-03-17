import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Header, Footer } from "../../components";
import Phone from "../../assets/images/contact-phone.png";
import Email from "../../assets/images/contact-email.png";
import back from "../../assets/images/back.png";

const EmployeePersonalDetails = () => {
  const navigate = useNavigate();

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
            <div className="flex h-32 w-32 items-center justify-center border-2 border-gray-300">
              <span className="text-gray-500">[Profile Image]</span>
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold">Employee Name</h2>
              <p className="text-gray-600">Employee ID#</p>
              <div className="mt-2 flex items-center space-x-4">
                <img src={Phone} alt="Phone" className="h-4 w-4" />
                <img src={Email} alt="Email" className="h-4 w-4" />
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
            Personal Information
          </div>
          <div className="grid grid-cols-2 gap-4 p-6">
            <p>
              <strong>Sex:</strong>{" "}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
            </p>
            <p>
              <strong>Age:</strong>{" "}
            </p>
            <p>
              <strong>Address:</strong>{" "}
            </p>
            <p>
              <strong>Employment Status:</strong>{" "}
            </p>
            <p>
              <strong>First Day of Service:</strong>{" "}
            </p>
            <p>
              <strong>Civil Status:</strong>{" "}
            </p>
            <p>
              <strong>Civil Service Eligibility:</strong>{" "}
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
