import profile from "../../../assets/images/account-black.png";
import print from "../../../assets/images/printer.png";
import arrow from "../../../assets/images/right-arrow.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Pagination from "../../../components/Pagination";
import { useForm } from "react-hook-form";
const FormThree = () => {
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/");
  };

  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return(
  <div  className="min-h-screen bg-blue-600 text-black flex flex-col">
    <header className="bg-white text-black flex justify-between items-center p-4 shadow-md">
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="Cabuyao Water District"
          className="h-8 mr-2"
        />
          <h1 className="font-jost">Cabuyao Water District</h1>
      </div>
      <nav className="flex items-center space-x-4">
        <a
          href="/dashboard"
          className="text-blue-700 font-semibold mr-10"
        >
          HOME
        </a>
        <div className="relative">
            <button
              className="cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
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

    <div className="relative ">
      <button className="absolute cursor-pointer right-0">
        <img src={print} alt="print-button" className="w-7 h-7 mt-15 mr-15" />
      </button>
    </div>

      <form className="mx-auto my-12 w-[1001px] border-4 bg-white" onSubmit={handleSubmit(onSubmit)} >
      {/* Voluntary Work Header */}
      <div className="border-2">
        <h2 className="bg-gray-600 text-sm font-bold text-white italic p-1">
          VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT / PEOPLE / VOLUNTARY ORGANIZATION/S
        </h2>
      </div>

        {/* Table Voluntary */}
        <table className="w-full border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-300">
              <th className="border px-2 py-1 w-[40%] text-left">
                &nbsp; 29. NAME & ADDRESS OF ORGANIZATION <br />
                <span className="text-[0.7rem]">(Write in full)</span>
              </th>
              <th className="border px-2 py-1 w-[20%]">
                INCLUSIVE DATES <br />
                <span className="text-[0.7rem]">(mm/dd/yyyy)</span>
                <div className="grid grid-cols-2 border-t mt-1">
                  <span className="border-r text-center">From</span>
                  <span className="text-center">To</span>
                </div>
              </th>
              <th className="border px-2 py-1 w-[10%]">NUMBER OF HOURS</th>
              <th className="border px-2 py-1 w-[30%]">POSITION / NATURE OF WORK</th>
            </tr>
          </thead>

          {/* Table Body (Empty Rows for Input) */}
          <tbody>
            {[...Array(7)].map((_, index) => (
              <tr key={index} className="border">
                <td className="border px-2 py-1"><input type="text" className="w-full outline-none" {...register('input1-${index}')} /></td>
                <td className="border px-2 py-1 grid grid-cols-2">
                  <input type="text" className="border-r w-full outline-none text-center" {...register('input2-${index}')} />
                  <input type="text" className="w-full outline-none text-center" {...register('input3-${index}')} />
                </td>
                <td className="border px-2 py-1"><input type="text" className="w-full outline-none text-center" {...register('input4-${index}')} /></td>
                <td className="border px-2 py-1"><input type="text" className="w-full outline-none" {...register('input5-${index}')} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xs text-red-500 italic text-center mt-1 font-bold bg-gray-200">
          (Continue on separate sheet if necessary)
        </p>

        <div className="border-2">
          <h2 className="bg-gray-600 text-sm font-bold text-white italic p-1">
            VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAMS ATTENDED <br />
            <span className="text-xs">(Start from the most recent L&D/training program and include only the relevant L&D/training taken for the last five (5) years for Division Chief/Executive/Managerial positions)</span>
          </h2>
       </div>

        {/* Table Learning... */}
        <table className="w-full border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-300">
              <th className="border px-2 py-1 w-[40%] text-left">
                &nbsp; 29. NAME & ADDRESS OF ORGANIZATION <br />
                <span className="text-[0.7rem]">(Write in full)</span>
              </th>
              <th className="border px-2 py-1 w-[20%]">
                INCLUSIVE DATES <br />
                <span className="text-[0.7rem]">(mm/dd/yyyy)</span>
                <div className="grid grid-cols-2 border-t mt-1">
                  <span className="border-r text-center">From</span>
                  <span className="text-center">To</span>
                </div>
              </th>
              <th className="border px-2 py-1 w-[10%]">NUMBER OF HOURS</th>
              <th className="border px-2 py-1 w-[10%]">Type of LD (Managerial/<br />Supervisory/<br />Technical/etc)</th>
              <th className="border px-2 py-1 w-[30%]">POSITION / NATURE OF WORK</th>
            </tr>
          </thead>

          {/* Table Body (Empty Rows for Input) */}
          <tbody>
            {[...Array(17)].map((_, index) => (
              <tr key={index} className="border">
                <td className="border px-2 py-1"><input type="text" className="w-full outline-none" {...register('input6-${index}')} /></td>
                <td className="border px-2 py-1 grid grid-cols-2">
                  <input type="text" className="border-r w-full outline-none text-center" {...register('input7-${index}')} />
                  <input type="text" className="w-full outline-none text-center" {...register('input8-${index}')} />
                </td>
                <td className="border px-2 py-1"><input type="text" className="w-full outline-none text-center" {...register('input9-${index}')} /></td>
                <td className="border px-2 py-1"><input type="text" className="w-full outline-none" {...register('input10-${index}')} /></td>
                <td className="border px-2 py-1"><input type="text" className="w-full outline-none" {...register('input11-${index}')} /></td>
              </tr>
            ))}
          </tbody>
        </table>  

        <p className="text-xs text-red-500 italic text-center mt-1 font-bold bg-gray-200">
          (Continue on separate sheet if necessary)
        </p>

        <div className="border-2">
          <h2 className="bg-gray-600 text-sm font-bold text-white italic p-1">
            VIII. OTHER INFORMATION
          </h2>
       </div>

        {/* Table Learning... */}
        <table className="w-full border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-300">
              <th className="border px-2 py-1 w-[40%] text-left">
                &nbsp; 31. SPECIAL SKILLS and HOBBIES
              </th>
              <th className="border px-2 py-1 w-[40%]">32. NON-ACADEMIC DISTINCTIONS / RECOGNITION <br />
              <span className="text-[0.7rem]">(Write in full)</span></th>
              <th className="border px-2 py-1 w-[30%]">33.MEMBERSHIP IN 
              ASSOCIATION/ORGANIZATION <br />
              <span className="text-[0.7rem]">(Write in full)</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {[...Array(7)].map((_, index) => (
              <tr key={index} className="border">
                <td className="border px-2 py-1"><input type="text" className="w-full outline-none" {...register('input12-${index}')} /></td>
                <td className="border px-2 py-1">
                  <input type="text" className="w-full outline-none" {...register('input13-${index}')} />
                </td>
                <td className="border px-2 py-1"><input type="text" className="w-full outline-none" {...register('input14-${index}')} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <p className="text-xs text-red-500 italic text-center mt-1 font-bold bg-gray-200">
          (Continue on separate sheet if necessary)
        </p>

        <table className="w-full border-collapse text-xs">
        <tbody>
          <tr>
            {/* Signature Section */}
            <td className="border  w-[15%]">
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
        <p className="text-white italic text-sm">CS FORM 212 (Revised 2017), Page 3 of 4</p>
        <button 
        className="flex items-center gap-2 bg-green-500 rounded-full hover:bg-green-300 cursor-pointer p-4"
        onClick={() => navigate("/form/4")}>
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
export default FormThree;