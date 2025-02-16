import print from "../../../assets/images/printer.png";
import arrow from "../../../assets/images/right-arrow.png";

import { useForm } from "react-hook-form";

const FormThree = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <div className="relative">
        <button className="absolute right-0 cursor-pointer">
          <img src={print} alt="print-button" className="mt-15 mr-15 h-7 w-7" />
        </button>
      </div>

      <form
        className="mx-auto my-12 w-[1001px] border-4 bg-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Voluntary Work Header */}
        <div className="border-2">
          <h2 className="bg-gray-600 p-1 text-sm font-bold text-white italic">
            VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT / PEOPLE
            / VOLUNTARY ORGANIZATION/S
          </h2>
        </div>

        {/* Table Voluntary */}
        <table className="w-full border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-300">
              <th className="w-[40%] border px-2 py-1 text-left">
                &nbsp; 29. NAME & ADDRESS OF ORGANIZATION <br />
                <span className="text-[0.7rem]">(Write in full)</span>
              </th>
              <th className="w-[20%] border px-2 py-1">
                INCLUSIVE DATES <br />
                <span className="text-[0.7rem]">(mm/dd/yyyy)</span>
                <div className="mt-1 grid grid-cols-2 border-t">
                  <span className="border-r text-center">From</span>
                  <span className="text-center">To</span>
                </div>
              </th>
              <th className="w-[10%] border px-2 py-1">NUMBER OF HOURS</th>
              <th className="w-[30%] border px-2 py-1">
                POSITION / NATURE OF WORK
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
                    className="w-full outline-none"
                    {...register("input1-${index}")}
                  />
                </td>
                <td className="grid grid-cols-2 border px-2 py-1">
                  <input
                    type="text"
                    className="w-full border-r text-center outline-none"
                    {...register("input2-${index}")}
                  />
                  <input
                    type="text"
                    className="w-full text-center outline-none"
                    {...register("input3-${index}")}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full text-center outline-none"
                    {...register("input4-${index}")}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full outline-none"
                    {...register("input5-${index}")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-1 bg-gray-200 text-center text-xs font-bold text-red-500 italic">
          (Continue on separate sheet if necessary)
        </p>

        <div className="border-2">
          <h2 className="bg-gray-600 p-1 text-sm font-bold text-white italic">
            VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAMS
            ATTENDED <br />
            <span className="text-xs">
              (Start from the most recent L&D/training program and include only
              the relevant L&D/training taken for the last five (5) years for
              Division Chief/Executive/Managerial positions)
            </span>
          </h2>
        </div>

        {/* Table Learning... */}
        <table className="w-full border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-300">
              <th className="w-[40%] border px-2 py-1 text-left">
                &nbsp; 29. NAME & ADDRESS OF ORGANIZATION <br />
                <span className="text-[0.7rem]">(Write in full)</span>
              </th>
              <th className="w-[20%] border px-2 py-1">
                INCLUSIVE DATES <br />
                <span className="text-[0.7rem]">(mm/dd/yyyy)</span>
                <div className="mt-1 grid grid-cols-2 border-t">
                  <span className="border-r text-center">From</span>
                  <span className="text-center">To</span>
                </div>
              </th>
              <th className="w-[10%] border px-2 py-1">NUMBER OF HOURS</th>
              <th className="w-[10%] border px-2 py-1">
                Type of LD (Managerial/
                <br />
                Supervisory/
                <br />
                Technical/etc)
              </th>
              <th className="w-[30%] border px-2 py-1">
                POSITION / NATURE OF WORK
              </th>
            </tr>
          </thead>

          {/* Table Body (Empty Rows for Input) */}
          <tbody>
            {[...Array(17)].map((_, index) => (
              <tr key={index} className="border">
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full outline-none"
                    {...register("input6-${index}")}
                  />
                </td>
                <td className="grid grid-cols-2 border px-2 py-1">
                  <input
                    type="text"
                    className="w-full border-r text-center outline-none"
                    {...register("input7-${index}")}
                  />
                  <input
                    type="text"
                    className="w-full text-center outline-none"
                    {...register("input8-${index}")}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full text-center outline-none"
                    {...register("input9-${index}")}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full outline-none"
                    {...register("input10-${index}")}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full outline-none"
                    {...register("input11-${index}")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-1 bg-gray-200 text-center text-xs font-bold text-red-500 italic">
          (Continue on separate sheet if necessary)
        </p>

        <div className="border-2">
          <h2 className="bg-gray-600 p-1 text-sm font-bold text-white italic">
            VIII. OTHER INFORMATION
          </h2>
        </div>

        {/* Table Learning... */}
        <table className="w-full border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-300">
              <th className="w-[40%] border px-2 py-1 text-left">
                &nbsp; 31. SPECIAL SKILLS and HOBBIES
              </th>
              <th className="w-[40%] border px-2 py-1">
                32. NON-ACADEMIC DISTINCTIONS / RECOGNITION <br />
                <span className="text-[0.7rem]">(Write in full)</span>
              </th>
              <th className="w-[30%] border px-2 py-1">
                33.MEMBERSHIP IN ASSOCIATION/ORGANIZATION <br />
                <span className="text-[0.7rem]">(Write in full)</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {[...Array(7)].map((_, index) => (
              <tr key={index} className="border">
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full outline-none"
                    {...register("input12-${index}")}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full outline-none"
                    {...register("input13-${index}")}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full outline-none"
                    {...register("input14-${index}")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-1 bg-gray-200 text-center text-xs font-bold text-red-500 italic">
          (Continue on separate sheet if necessary)
        </p>

        <table className="w-full border-collapse text-xs">
          <tbody>
            <tr>
              {/* Signature Section */}
              <td className="w-[15%] border">
                <div className="border-r bg-gray-300 p-1 text-center font-bold italic">
                  SIGNATURE
                </div>
              </td>
              <td className="w-1/3 border"></td>

              {/* Date Section */}
              <td className="w-[15%] border">
                <div className="border-r bg-gray-300 p-1 text-center font-bold italic">
                  DATE
                </div>
              </td>
              <td className="w-1/3 border"></td>
            </tr>
          </tbody>
        </table>
      </form>

      <div className="relative flex h-full items-end justify-end p-4">
        <div className="flex items-center gap-4">
          <p className="text-sm text-white italic">
            CS FORM 212 (Revised 2017), Page 3 of 4
          </p>
          <button
            className="flex cursor-pointer items-center gap-2 rounded-full bg-green-500 p-4 hover:bg-green-300"
            // onClick={() => navigate("/form/4")}
          >
            <span className="font-semibold text-white">Next</span>
            <img src={arrow} alt="arrow-right" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default FormThree;
