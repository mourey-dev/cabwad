import arrow from "../../../assets/images/right-arrow.png";

import { UseFormRegister } from "react-hook-form";
import PDSForm from "../../../types/form";

type FormTwoProps = {
  register: UseFormRegister<PDSForm>;
};

const FormTwo = ({ register }: FormTwoProps) => {
  return (
    <div>
      {/*Forms CSC Page 2*/}
      <form className="mx-auto my-12 w-[1001px] border-4 bg-white">
        {/* Civil Service Eligibility Header */}
        <div className="border-2">
          <h2 className="bg-gray-600 p-1 text-xs font-bold text-white italic">
            IV. CIVIL SERVICE ELIGIBILITY
          </h2>
        </div>

        {/* Table */}
        <div className="border-2">
          <table className="w-full border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className="border bg-gray-300">
                <th className="w-[40%] border px-2 py-1 text-left">
                  &nbsp; 27. CAREER SERVICE/ RA 1080 (BOARD/ BAR) UNDER <br />
                  SPECIAL LAWS/ CES/ CSEE <br />
                  BARANGAY ELIGIBILITY / DRIVER'S LICENSE
                </th>
                <th className="w-[10%] border px-2 py-1">
                  RATING <br /> (If Applicable)
                </th>
                <th className="w-[15%] border px-2 py-1">
                  DATE OF <br /> EXAMINATION / <br /> CONFERMENT
                </th>
                <th className="w-[15%] border px-2 py-1">
                  PLACE OF EXAMINATION / <br /> CONFERMENT
                </th>

                {/* LICENSE (if applicable) column formatted as a grid */}
                <th className="w-[20%] border px-2 py-1">
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
                      {...register(`civil_service_eligibility.${index}.cse`)}
                      className={`w-full text-center outline-none`}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(
                        `civil_service_eligibility.${index}.cse_rating`,
                      )}
                      className={`w-full text-center outline-none`}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(
                        `civil_service_eligibility.${index}.cse_exam_date`,
                      )}
                      className={`w-full text-center outline-none`}
                    />
                  </td>

                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(
                        `civil_service_eligibility.${index}.cse_exam_place`,
                      )}
                      className={`w-full text-center outline-none`}
                    />
                  </td>

                  {/* LICENSE (if applicable) column formatted for input fields */}
                  <td className="grid grid-cols-2 border px-2 py-1">
                    <input
                      type="text"
                      {...register(
                        `civil_service_eligibility.${index}.cse_license_number`,
                      )}
                      className={`border-r text-center outline-none`}
                    />
                    <input
                      type="text"
                      {...register(
                        `civil_service_eligibility.${index}.cse_validity_date`,
                      )}
                      className={`text-center outline-none`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 bg-gray-200 text-center text-xs font-bold text-red-500 italic">
            (Continue on separate sheet if necessary)
          </p>
        </div>

        <div className="border-2">
          <h2 className="bg-gray-600 p-1 text-xs font-bold text-white italic">
            V. WORK EXPERIENCE <br />
            Include private employment. Start from your recent work Description
            of duties should be indicated in the attached Work Experience sheet
          </h2>

          <table className="w-full border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className="border bg-gray-300">
                {/* Inclusive Dates */}
                <th className="w-[15%] border px-2 py-1">
                  28. INCLUSIVE DATES <br /> (mm/dd/yyyy)
                  <div className="mt-1 grid grid-cols-2 border-t">
                    <span className="border-r text-center">From</span>
                    <span className="text-center">To</span>
                  </div>
                </th>

                {/* Position Title */}
                <th className="w-[20%] border px-2 py-1">
                  POSITION TITLE <br />
                  <span className="text-[.75rem] font-light">
                    (Write in full/Do not abbreviate)
                  </span>
                </th>

                {/* Department / Agency */}
                <th className="w-[20%] border px-2 py-1">
                  DEPARTMENT / AGENCY / OFFICE / COMPANY <br />
                  <span className="text-[.75rem] font-light">
                    (Write in full/Do not abbreviate)
                  </span>
                </th>

                {/* Monthly Salary */}
                <th className="w-[10%] border px-2 py-1">MONTHLY SALARY</th>

                {/* Salary/Job/Pay Grade */}
                <th className="w-[15%] border px-2 py-1">
                  SALARY/ JOB/ PAY GRADE (if applicable) & STEP <br />
                  <span className="text-[.75rem]">
                    (Format: "00-00")/ INCREMENT
                  </span>
                </th>

                {/* Status of Appointment */}
                <th className="w-[10%] border px-2 py-1">
                  STATUS OF APPOINTMENT
                </th>

                {/* Govt Service */}
                <th className="w-[5%] border px-2 py-1">
                  GOVT SERVICE <br /> (Y/N)
                </th>
              </tr>
            </thead>

            {/* Table Body (Empty Rows for Input) */}
            <tbody>
              {[...Array(28)].map((_, index) => (
                <tr key={index} className="border">
                  {/* Inclusive Dates */}
                  <td className="grid grid-cols-2 border px-2 py-1">
                    <input
                      type="text"
                      {...register(`work_experience.${index}.w_from`)}
                      className={`border-r text-center outline-none`}
                    />
                    <input
                      type="text"
                      {...register(`work_experience.${index}.w_to`)}
                      className={`text-center outline-none`}
                    />
                  </td>

                  {/* Position Title */}
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`work_experience.${index}.w_position`)}
                      className={`w-full text-center outline-none`}
                    />
                  </td>

                  {/* Department / Agency */}
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`work_experience.${index}.w_department`)}
                      className={`w-full text-center outline-none`}
                    />
                  </td>

                  {/* Monthly Salary */}
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`work_experience.${index}.w_salary`)}
                      className={`w-full text-center outline-none`}
                    />
                  </td>

                  {/* Salary/Job/Pay Grade */}
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`work_experience.${index}.w_pay_grade`)}
                      className={`w-full text-center outline-none`}
                    />
                  </td>

                  {/* Status of Appointment */}
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      {...register(`work_experience.${index}.w_soa`)}
                      className={`w-full text-center outline-none`}
                    />
                  </td>

                  {/* Govt Service */}
                  <td className="border px-2 py-1 text-center">
                    <input
                      type="text"
                      {...register(`work_experience.${index}.w_gov_service`)}
                      className={`w-full text-center outline-none`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 bg-gray-200 text-center text-xs font-bold text-red-500 italic">
            (Continue on separate sheet if necessary)
          </p>
        </div>

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
              <td>
                {" "}
                <input
                  type="text"
                  title="w_date"
                  {...register(`other_information.w_date`)}
                  className="w-full border text-[1.1rem]"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      <div className="relative flex h-full items-end justify-end p-4">
        <div className="flex items-center gap-4">
          <p className="text-sm text-white italic">
            CS FORM 212 (Revised 2017), Page 2 of 4
          </p>
          <button
            className="flex cursor-pointer items-center gap-2 rounded-full bg-green-500 p-4 hover:bg-green-300"
            // onClick={() => navigate("/form/3")}
          >
            <span className="font-semibold text-white">Next</span>
            <img src={arrow} alt="arrow-right" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormTwo;
