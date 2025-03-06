import arrow from "../../../assets/images/right-arrow.png";

import { UseFormRegister } from "react-hook-form";
import PDSForm from "../../../types/form";
import { useNavigate } from "react-router-dom";

type FormThreeProps = {
  register: UseFormRegister<PDSForm>;
};

const FormThree = ({ register }: FormThreeProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <form
        className="mx-auto my-12 w-[1001px] border-4 bg-white"
        autoComplete="off"
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
                    className="w-full text-center uppercase outline-none"
                    {...register(`voluntary_work.${index}.vw_organization`)}
                  />
                </td>
                <td className="grid grid-cols-2 border px-2 py-1">
                  <input
                    type="text"
                    className="w-full border-r text-center uppercase outline-none"
                    {...register(`voluntary_work.${index}.vw_from`)}
                  />
                  <input
                    type="text"
                    className="w-full text-center uppercase outline-none"
                    {...register(`voluntary_work.${index}.vw_to`)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full text-center uppercase outline-none"
                    {...register(`voluntary_work.${index}.vw_hours`)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full text-center uppercase outline-none"
                    {...register(`voluntary_work.${index}.vw_position`)}
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
                    className="w-full text-center uppercase outline-none"
                    {...register(`learning_development.${index}.ld_learning`)}
                  />
                </td>
                <td className="grid grid-cols-2 border px-2 py-1">
                  <input
                    type="text"
                    className="w-full border-r text-center uppercase outline-none"
                    {...register(`learning_development.${index}.ld_from`)}
                  />
                  <input
                    type="text"
                    className="w-full text-center uppercase outline-none"
                    {...register(`learning_development.${index}.ld_to`)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full text-center uppercase outline-none"
                    {...register(`learning_development.${index}.ld_hours`)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full text-center uppercase outline-none"
                    {...register(`learning_development.${index}.ld_type`)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full text-center uppercase outline-none"
                    {...register(`learning_development.${index}.ld_conducted`)}
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
                    className="w-full text-center uppercase outline-none"
                    {...register(`other_information.skills.${index}.of_skill`)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full text-center uppercase outline-none"
                    {...register(
                      `other_information.skills.${index}.of_recognition`,
                    )}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full text-center uppercase outline-none"
                    {...register(
                      `other_information.skills.${index}.of_membership`,
                    )}
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
              <td className="w-1/3 border">
                <input
                  type="text"
                  title="form_three_date"
                  {...register("other_information.of_date")}
                  className="w-full text-center text-[1.1rem]"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      <div className="relative bottom-15 mx-auto flex h-full w-[1001px] items-end justify-end p-4">
        <div className="relative flex flex-col items-end gap-4">
          <p className="text-sm text-white italic">
            CS FORM 212 (Revised 2017), Page 3 of 4
          </p>
          <button
            type="button"
            className="absolute top-10 right-[-20px] flex cursor-pointer items-center gap-2 rounded-full bg-green-500 p-4 hover:bg-green-300"
            onClick={() => navigate("/form/4")}
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
