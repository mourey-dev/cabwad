import profile from "../../../assets/images/account-black.png";
import print from "../../../assets/images/printer.png";
import arrow from "../../../assets/images/right-arrow.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Pagination from "../../../components/Pagination";
import { useForm } from "react-hook-form";

const FormTwo = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/");
  };

  const handleFocus = (index: string) => {
    setFocusedInput(index);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };


  return (
    <div className="min-h-screen bg-blue-600 text-black flex flex-col">
      <header className="bg-white text-black flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center">
          <img src="/logo.png" alt="Cabuyao Water District" className="h-8 mr-2" />
          <h1 className="font-jost">Cabuyao Water District</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <a href="/dashboard" className="text-blue-700 font-semibold mr-10">
            HOME
          </a>
          <div className="relative">
            <button className="cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
              <img src={profile} alt="profile-logo" className="w-6 h-6" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-1 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <div className="relative">
        <button className="absolute cursor-pointer right-0">
          <img src={print} alt="print-button" className="w-7 h-7 mt-15 mr-15" />
        </button>
      </div>

      {/*Forms CSC Page 2*/}
      <form className="mx-auto my-12 w-[1001px] border-4 bg-white" onSubmit={handleSubmit(onSubmit)}>
        {/* Civil Service Eligibility Header */}
        <div className="border-2">
          <h2 className="bg-gray-600 text-xs font-bold text-white italic p-1">
            IV. CIVIL SERVICE ELIGIBILITY
          </h2>
        </div>

        {/* Table */}
        <div className="border-2">
          <table className="w-full border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-300 border">
                <th className="border px-2 py-1 text-left w-[40%]">
                  &nbsp; 27. CAREER SERVICE/ RA 1080 (BOARD/ BAR) UNDER <br />
                  SPECIAL LAWS/ CES/ CSEE <br />
                  BARANGAY ELIGIBILITY / DRIVER'S LICENSE
                </th>
                <th className="border px-2 py-1 w-[10%]">RATING <br /> (If Applicable)</th>
                <th className="border px-2 py-1 w-[15%]">DATE OF <br /> EXAMINATION / <br /> CONFERMENT</th>
                <th className="border px-2 py-1 w-[15%]">PLACE OF EXAMINATION / <br /> CONFERMENT</th>

                {/* LICENSE (if applicable) column formatted as a grid */}
                <th className="border px-2 py-1 w-[20%]">
                  <div className="grid grid-cols-2 grid-rows-2">
                    <span className="col-span-2 row-span-1 border-b text-center text-[.7rem] font-semibold">
                      LICENSE (if applicable)
                    </span>
                    <span className="col-span-1 row-span-1 border-r text-center text-[.7rem]">
                      NUMBER
                    </span>
                    <span className="col-span-1 row-span-1 text-center text-[.7rem]">
                      Date of Validity
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body (Empty Rows for Input) */}
            <tbody>
              {[...Array(7)].map((_, index) => (
                <tr key={index} className="border">
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register('input1-${index}')}
                      className={`w-full outline-none ${focusedInput === `input1-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input1-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register('input2-${index}')}
                      className={`w-full outline-none ${focusedInput === `input2-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input2-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`input3-${index}`)}
                      className={`w-full outline-none ${focusedInput === `input3-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input3-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`input4-${index}`)}
                      className={`w-full outline-none ${focusedInput === `input4-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input4-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>

                  {/* LICENSE (if applicable) column formatted for input fields */}
                  <td className="border px-2 py-1 grid grid-cols-2">
                    <input
                      type="text"
                      {...register(`input5-${index}`)}
                      className={`border-r outline-none text-center ${focusedInput === `input5-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input5-${index}`)}
                      onBlur={handleBlur}
                    />
                    <input
                      type="text"
                      {...register(`input6-${index}`)}
                      className={`outline-none text-center ${focusedInput === `input6-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input6-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-red-500 italic text-center mt-1 font-bold bg-gray-200">
            (Continue on separate sheet if necessary)
          </p>
        </div>

        <div className="border-2">
          <h2 className="bg-gray-600 text-xs font-bold text-white italic p-1">
            V. WORK EXPERIENCE <br />
            Include private employment. Start from your recent work Description of duties should be indicated in the attached Work Experience sheet
          </h2>

          <table className="w-full border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-300 border">
                {/* Inclusive Dates */}
                <th className="border px-2 py-1 w-[15%]">
                  28. INCLUSIVE DATES <br /> (mm/dd/yyyy)
                  <div className="grid grid-cols-2 border-t"></div>
                </th>

                {/* Position Title */}
                <th className="border px-2 py-1 w-[20%]">
                  POSITION TITLE <br />
                  <span className="text-[.75rem] font-light">(Write in full/Do not abbreviate)</span>
                </th>

                {/* Department / Agency */}
                <th className="border px-2 py-1 w-[20%]">
                  DEPARTMENT / AGENCY / OFFICE / COMPANY <br />
                  <span className="text-[.75rem] font-light">(Write in full/Do not abbreviate)</span>
                </th>

                {/* Monthly Salary */}
                <th className="border px-2 py-1 w-[10%]">MONTHLY SALARY</th>

                {/* Salary/Job/Pay Grade */}
                <th className="border px-2 py-1 w-[15%]">
                  SALARY/ JOB/ PAY GRADE (if applicable) & STEP <br />
                  <span className="text-[.75rem]">(Format: "00-00")/ INCREMENT</span>
                </th>

                {/* Status of Appointment */}
                <th className="border px-2 py-1 w-[10%]">STATUS OF APPOINTMENT</th>

                {/* Govt Service */}
                <th className="border px-2 py-1 w-[5%]">GOVT SERVICE <br /> (Y/N)</th>
              </tr>
            </thead>

            {/* Table Body (Empty Rows for Input) */}
            <tbody>
              {[...Array(28)].map((_, index) => (
                <tr key={index} className="border">
                  {/* Inclusive Dates */}
                  <td className="border px-2 py-1 grid grid-cols-2">
                    <input
                      type="text"
                      {...register(`input7-${index}`)}
                      className={`border-r outline-none text-center ${focusedInput === `input7-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input7-${index}`)}
                      onBlur={handleBlur}
                    />
                    <input
                      type="text"
                      {...register(`input8-${index}`)}
                      className={`outline-none text-center ${focusedInput === `input8-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input8-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>
            
                  {/* Position Title */}
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`input9-${index}`)}
                      className={`w-full outline-none ${focusedInput === `input9-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input9-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>
            
                  {/* Department / Agency */}
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`input10-${index}`)}
                      className={`w-full outline-none ${focusedInput === `input10-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input10-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>
            
                  {/* Monthly Salary */}
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`input11-${index}`)}
                      className={`w-full outline-none text-center ${focusedInput === `input11-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input11-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>
            
                  {/* Salary/Job/Pay Grade */}
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`input12-${index}`)}
                      className={`w-full outline-none text-center ${focusedInput === `input12-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input12-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>
            
                  {/* Status of Appointment */}
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`input13-${index}`)}
                      className={`w-full outline-none text-center ${focusedInput === `input13-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input13-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>
            
                  {/* Govt Service */}
                  <td className="border px-2 py-1 text-center">
                    <input
                      type="text"
                      {...register(`input14-${index}`)}
                      className={`w-full outline-none text-center ${focusedInput === `input14-${index}` ? 'bg-yellow-200' : ''}`}
                      onFocus={() => handleFocus(`input14-${index}`)}
                      onBlur={handleBlur}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-red-500 italic text-center mt-1 font-bold bg-gray-200">
            (Continue on separate sheet if necessary)
          </p>
        </div>

        <table className="w-full border-collapse text-xs">
          <tbody>
            <tr>
              {/* Signature Section */}
              <td className="border w-[15%]">
                <div className="bg-gray-300 text-center font-bold italic p-1 border-r">
                  SIGNATURE
                </div>
              </td>
              <td className="border w-1/3"></td>

              {/* Date Section */}
              <td className="border w-[15%]">
                <div className="bg-gray-300 text-center font-bold italic p-1 border-r">
                  DATE
                </div>
              </td>
              <td className="border w-1/3"></td>
            </tr>
          </tbody>
        </table>
      </form>

      <div className="relative h-full flex justify-end items-end p-4">
        <div className="flex items-center gap-4">
          <p className="text-white italic text-sm">CS FORM 212 (Revised 2017), Page 2 of 4</p>
          <button
            className="flex items-center gap-2 bg-green-500 rounded-full hover:bg-green-300 cursor-pointer p-4"
            onClick={() => navigate("/form/3")}
          >
            <span className="text-white font-semibold">Next</span>
            <img src={arrow} alt="arrow-right" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Pagination />

      <div>
        {/* Footer */}
        <footer className="bg-yellow-500 text-black text-center p-4 font-inter">
          <p>
            COPYRIGHT © 2025 |{" "}
            <span className="text-blue-700 font-semibold font-inter">
              CABUYAO WATER DISTRICT
            </span>{" "}
            ALL RIGHTS RESERVED
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FormTwo;
