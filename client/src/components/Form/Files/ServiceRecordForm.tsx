import React, { useState } from "react";
import logo from "../../../assets/images/logo-white.png";
import { Header, Footer } from "../../../components";
import BackButton from "../../../components/BackButton";

const ServiceRecordForm: React.FC = () => {
  const [isEditable, setIsEditable] = useState(false);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleToggleChange = () => {
    setIsEditable((prev) => !prev);
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-blue-700 p-8 text-black">
        {/* Back Button */}
        <div className="mb-4 flex items-center justify-between">
          <BackButton onClick={handleBackClick} />

          {/* Toggle Switch */}
          <div className="mr-4 inline-block">
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                onChange={handleToggleChange}
              />
              <div
                className={`peer relative h-6 w-11 rounded-full bg-gray-500 peer-checked:bg-yellow-400 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white`}
              ></div>
              <span className="text-yellow ms-3 text-sm font-medium">
                UPDATE
              </span>
            </label>
          </div>
        </div>

        <div className="mx-auto w-full overflow-x-auto">
          <form
            className="mx-auto w-[1100px] border-4 bg-white"
            autoComplete="off"
          >
            {/* Header Section */}
            <div className="bg-white px-10 py-10">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="">
                  <img src={logo} alt="Company Logo" className="h-30 w-30" />
                </div>

                {/* Header Text */}
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
                    E-mail add: cabuyaowaterdistrict@gmail.com
                  </p>
                  <h2 className="font-jost mt-4 text-2xl font-extrabold tracking-wide">
                    SERVICE RECORD
                  </h2>
                </div>

                {/* Employee ID */}
                <div className="">
                  <label htmlFor="employee-id" className="text-xs">
                    (Employee ID)
                  </label>
                </div>
              </div>
            </div>

            {/* Name Input Fields */}
            <div className="mt-4 mr-5 mb-4 ml-5 border-b border-black pb-2">
              <label className="block text-left font-semibold">Name:</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  className="border border-gray-300 bg-gray-100 p-2 font-semibold uppercase"
                  style={{ width: "400px" }}
                  placeholder="Surname"
                  disabled={!isEditable}
                />
                <input
                  type="text"
                  className="border border-gray-300 bg-gray-100 p-2 font-semibold uppercase"
                  style={{ width: "400px" }}
                  placeholder="Given Name"
                  disabled={!isEditable}
                />
                <input
                  type="text"
                  className="border border-gray-300 bg-gray-100 p-2 font-semibold uppercase"
                  style={{ width: "400px" }}
                  placeholder="Middle Name"
                  disabled={!isEditable}
                />
                <p className="mt-1 text-xs text-black">
                  (If married woman, provide full maiden name)
                </p>
              </div>
            </div>

            {/* Birth Input Fields */}
            <div className="mr-5 mb-4 ml-5 border-b border-black pb-2">
              <label className="block text-left font-semibold">Birth:</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="date"
                  className="border border-gray-300 bg-gray-100 p-2 font-semibold"
                  style={{ width: "630px" }}
                  disabled={!isEditable}
                />
                <input
                  type="text"
                  className="border border-gray-300 bg-gray-100 p-2 font-semibold uppercase"
                  style={{ width: "630px" }}
                  placeholder="Place of Birth"
                  disabled={!isEditable}
                />
                <p className="mt-1 text-xs text-black">
                  (Date herein should be checked from birth or baptismal
                  certificate or some other reliable documents)
                </p>
              </div>
            </div>

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
                  <th className="border border-black px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {[...Array(21)].map((_, index) => (
                  <tr key={index} className="text-center text-xs">
                    <td className="border border-black px-2 py-3">
                      <input
                        type="text"
                        className="bg-transparent text-center outline-none"
                        style={{ width: "105px" }}
                        disabled={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-2 py-3">
                      <input
                        type="text"
                        className="bg-transparent text-center outline-none"
                        style={{ width: "105px" }}
                        disabled={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-10 py-3">
                      <input
                        type="text"
                        className="bg-transparent text-center uppercase outline-none"
                        style={{ width: "190px" }}
                        disabled={!isEditable}
                      />
                    </td>
                    <td className="border border-black py-3">
                      <input
                        type="text"
                        className="bg-transparent text-center uppercase outline-none"
                        style={{ width: "100px" }}
                        disabled={!isEditable}
                      />
                    </td>
                    <td className="border border-black py-3">
                      <input
                        type="number"
                        className="bg-transparent text-center outline-none"
                        style={{ width: "100px" }}
                        disabled={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-2 py-3">
                      <input
                        type="text"
                        className="bg-transparent text-center uppercase outline-none"
                        style={{ width: "200px" }}
                        disabled={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-2 py-3">
                      <input
                        type="text"
                        className="bg-transparent text-center uppercase outline-none"
                        style={{ width: "125px" }}
                        disabled={!isEditable}
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
            <div className="mt-8 mb-10 flex justify-between px-10 text-center">
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
          </form>

          {/* Print and Save Buttons */}
          <div className="mx-auto mt-6 flex w-[1400px] justify-end gap-4 px-38">
            <button
              className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
              disabled={!isEditable}
            >
              Print
            </button>
            <button
              className="rounded bg-green-500 px-6 py-2 text-white hover:bg-green-600"
              disabled={!isEditable}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceRecordForm;
