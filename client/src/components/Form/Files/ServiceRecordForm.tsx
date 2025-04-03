import React from "react";
import logo from "../../../assets/images/logo-white.png";
import { Header, Footer } from "../../../components";
import BackButton from "../../../components/BackButton"; // Import BackButton

const ServiceRecordForm: React.FC = () => {
  const handleBackClick = () => {
    // Logic for navigating back, e.g., using history from react-router-dom
    window.history.back();
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-blue-700 p-8 text-black">
        <div className="min-h-screen bg-blue-700 p-8 text-black">
          {/* Back Button */}
          <div className="mb-4">
            <BackButton onClick={handleBackClick} />
          </div>

          {/* Header Section */}
          <div className="border-b bg-white px-10 py-10 pb-4">
            <div className="flex items-center">
              <div className="absolute left-100">
                <img src={logo} alt="Company Logo" className="h-30 w-32" />
              </div>
              {/* Header Text centered */}
              <div className="flex-grow text-center">
                <h1 className="text-xl font-bold">CABUYAO WATER DISTRICT</h1>
                <p
                  className="mt-2 text-sm"
                  style={{ fontFamily: "'Times New Roman'" }}
                >
                  B1 L40 Katapatan Homes, Banay-Banay, Cabuyao, Laguna
                </p>
                <p
                  className="mt-2 text-sm"
                  style={{ fontFamily: "'Times New Roman'" }}
                >
                  Tel: (049) 832-1620 / 304-0049
                </p>
                <p
                  className="mt-2 text-sm"
                  style={{ fontFamily: "'Times New Roman'" }}
                >
                  E-mail: cabuyaowaterdistrict@gmail.com
                </p>
                {/* Service Record Title */}
                <h2 className="font-jost mt-4 bg-white text-center text-2xl font-extrabold tracking-wide">
                  SERVICE RECORD
                </h2>
              </div>
              <div className="absolute right-35 mt-23">
                <label htmlFor="" className="text-xs">
                  (Employee ID)
                </label>
              </div>
            </div>

            {/* Name Input Fields */}
            <div className="mt-4 mb-4 border-b border-black pb-2">
              <label className="block text-left font-semibold">Name:</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  className="w-1/3 border border-gray-300 bg-gray-100 p-2 uppercase"
                  placeholder="Surname"
                />
                <input
                  type="text"
                  className="w-1/3 border border-gray-300 bg-gray-100 p-2 uppercase"
                  placeholder="Given Name"
                />
                <input
                  type="text"
                  className="w-1/3 border border-gray-300 bg-gray-100 p-2 uppercase"
                  placeholder="Middle Name"
                />
                <p className="mt-1 text-xs text-black">
                  (If married woman, provide full maiden name)
                </p>
              </div>
            </div>

            {/* Birth Input Fields */}
            <div className="mb-4 border-b border-black pb-2">
              <label className="block text-left font-semibold">Birth:</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="date"
                  className="w-1/2 border border-gray-300 bg-gray-100 p-2"
                />
                <input
                  type="text"
                  className="w-1/2 border border-gray-300 bg-gray-100 p-2 uppercase"
                  placeholder="Place of Birth"
                />
                <p className="mt-1 text-xs text-black">
                  (Date should be verified from birth certificate or other
                  reliable documents)
                </p>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-black">
              This is to certify that the employee above rendered services in
              this office as shown in the service record below, each line
              <br />
              supported by appointment and other official documents issued by
              this Office.
            </p>

            {/* Table Section */}
            <table className="mt-4 w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-300 text-center text-xs font-bold">
                  <th className="border border-black px-2 py-1" colSpan={2}>
                    SERVICE <br />
                    (Inclusive Dates)
                  </th>
                  <th className="border border-black px-2 py-1" colSpan={3}>
                    RECORD OF APPOINTMENT
                  </th>
                  <th className="border border-black px-2 py-1">
                    OFFICE ENTITY/DIVISION
                  </th>
                  <th className="border border-black px-2 py-1">
                    Leave of Absence w/o Pay
                  </th>
                </tr>
                <tr className="bg-gray-200 text-center text-xs font-bold">
                  <th className="border border-black px-2 py-1">From</th>
                  <th className="border border-black px-2 py-1">To</th>
                  <th className="border border-black px-2 py-1">Designation</th>
                  <th className="border border-black px-2 py-1">Status</th>
                  <th className="border border-black px-2 py-1">Salary</th>
                  <th className="border border-black px-2 py-1">
                    Station/Place of Assignment
                  </th>
                  <th className="border border-black px-2 py-1">Pay</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(21)].map((_, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-black px-2 py-3">
                      <input
                        type="date"
                        className="w-full bg-transparent text-center outline-none"
                      />
                    </td>
                    <td className="border border-black px-2 py-3">
                      <input
                        type="date"
                        className="w-full bg-transparent text-center outline-none"
                      />
                    </td>
                    <td className="border border-black px-10 py-3">
                      <input
                        type="text"
                        className="w-full bg-transparent text-center uppercase outline-none"
                      />
                    </td>
                    <td className="border border-black py-3">
                      <input
                        type="text"
                        className="w-full bg-transparent text-center uppercase outline-none"
                      />
                    </td>
                    <td className="border border-black py-3">
                      <input
                        type="number"
                        className="w-full bg-transparent text-center outline-none"
                      />
                    </td>
                    <td className="border border-black px-2 py-3">
                      <input
                        type="text"
                        className="w-full bg-transparent text-center uppercase outline-none"
                      />
                    </td>
                    <td className="border border-black px-2 py-3">
                      <input
                        type="text"
                        className="w-full bg-transparent text-center uppercase outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Compliance Statement */}
            <p className="mt-6 text-center text-sm italic">
              Issued in compliance with Executive Order No. 54 dated August 10,
              1954, and in accordance with Circular No. 58, dated August 10,
              1954.
            </p>

            {/* Certification & Noted By Section */}
            <div className="mt-8 flex justify-between px-10 text-center">
              <div className="w-1/2">
                <p className="mb-15 text-left text-sm font-semibold italic">
                  CERTIFIED CORRECT:
                </p>
                <hr className="mx-auto my-2 w-64 border-black" />
                <p className="font-bold">MARY ROSE A. AGUILLO</p>
                <p className="text-sm">Division Manager C</p>
                <p className="text-sm">Administrative and General Services</p>
              </div>

              <div className="w-1/2">
                <p className="mb-15 text-left text-sm font-semibold italic">
                  NOTED BY:
                </p>
                <hr className="mx-auto my-2 w-64 border-black" />
                <p className="font-bold">ARNOLD G. VALENCIA</p>
                <p className="text-sm">General Manager</p>
              </div>
            </div>
          </div>
          {/* Save Button */}
          <div className="mx-auto mt-6 flex items-end justify-end text-center">
            <button
              type="button"
              className="mr-5 rounded-full bg-yellow-500 px-10 py-2 text-white hover:bg-yellow-400"
            >
              Save
            </button>
            <button
              type="button"
              className="rounded-full bg-green-500 px-10 py-2 text-white hover:bg-green-400"
            >
              Print
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceRecordForm;
