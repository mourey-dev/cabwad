import arrow from "../../../assets/images/right-arrow.png";

import { UseFormRegister } from "react-hook-form";
import PDSForm from "../../../types/form";
import { useNavigate } from "react-router-dom";

type FormOneProps = {
  register: UseFormRegister<PDSForm>;
};

const FormOne = ({ register }: FormOneProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <form className="mx-auto my-12 grid h-full w-[1001px] border-4 bg-white">
        {/* First Grid Row */}
        <div className="1fr relative">
          <div className="absolute flex flex-col">
            <span className="text-[.8rem] font-bold italic">
              CS Form No. 212
            </span>
            <span className="text-[.7rem] font-bold italic">Revised 2017</span>
          </div>

          <h1 className="mt-4 text-center text-3xl font-extrabold">
            PERSONAL DATA SHEET
          </h1>

          <div>
            <p className="mt-2 text-[.9rem] font-bold tracking-tight italic">
              WARNING: Any misinterpretation made in the Personal Data Sheet and
              the Work Experience Sheet shall cause the filing of
              administrative/criminal case/s against the person concerned.
            </p>
            <p className="text-[.9rem] font-bold tracking-tight italic">
              READ THE ATTACHED GUIDE TO FILLING OUT THE PERSONAL DATA SHEET
              (PDS) BEFORE ACCOMPLISHING THE PDS FORM.
            </p>
            <div>
              <div className="flex">
                <div className="flex items-center gap-0.5">
                  <span className="text-[.9rem]">
                    Print legibly. Tick appropriate boxes
                  </span>
                  <div className="ml- h-3 w-3 border-[1px]"></div>
                  <span className="text-[.9rem]">
                    ) and use separate sheet if necessary. Indicate N/A if not
                    applicable.{" "}
                  </span>
                </div>

                <div className="flex pl-1">
                  <span className="px-1 text-[.7rem] font-bold">
                    DO NOT ABBREVIATE.
                  </span>
                  <span className="border-2 bg-gray-600 text-[.6rem] tracking-tighter text-white">
                    1. CS ID No.
                  </span>
                  <span className="w-36 border-2 pr-1 text-right text-[.6rem] tracking-tighter">
                    (Do not fill up. For CSC use only)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="border-2">
          <h2 className="bg-gray-600 text-sm font-bold text-white italic">
            I. PERSONAL INFORMATION
          </h2>
        </div>

        <div className="grid grid-cols-5">
          <label
            htmlFor="personal_surname"
            className="col-span-1 border-2 border-b-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;2. SURNAME
          </label>
          <input
            type="text"
            id="personal_surname"
            className="col-span-4 border-2 p-2"
            {...register("personal_information.p_surname")}
          />
          <label
            htmlFor="personal_first_name"
            className="col-span-1 border-2 border-y-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FIRST NAME
          </label>
          <input
            type="text"
            id="personal_first_name"
            className="col-span-3 border-2 p-2"
            {...register("personal_information.p_first_name")}
          />
          <div className="relative border-2 bg-gray-300">
            <label
              htmlFor="personal_name_extension"
              className="absolute pl-1 text-[.5rem] tracking-tighter"
            >
              NAME EXTENSION (JR., SR)
            </label>
            <input
              type="text"
              id="personal_name_extension"
              className="w-full p-2 align-text-bottom"
              {...register("personal_information.p_name_extension")}
            />
          </div>
          <label
            htmlFor="personal_last_name"
            className="col-span-1 border-2 border-t-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MIDDLE NAME
          </label>
          <input
            type="text"
            id="personal_middle_name"
            className="col-span-4 border-2 p-2"
            {...register("personal_information.p_middle_name")}
          />
          <label
            htmlFor="personal_last_name"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;3. DATE OF BIRTH
            <span className="block text-[.9rem]">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(mm/dd/yyyy)
            </span>
          </label>
          <input
            type="Date"
            id="birthdate"
            className="col-span-1 border-2 p-2"
            {...register("personal_information.p_birth_date")}
          />

          <div className="col-span-3 row-span-3 grid grid-cols-3 border-2">
            <div className="col-span-1 border-r-2 bg-gray-300">
              <span className="tracking-tighter">&nbsp;16. CITIZENSHIP</span>
              <div>
                <span className="text-[.7rem]">
                  If holder of dual citizenship,
                </span>
                <span className="text-[.7rem]">
                  &nbsp;please indicate the details.
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <div className="inline-block">
                <input
                  type="checkbox"
                  id="citizen_filipino"
                  className="mx-2"
                  {...register("personal_information.p_citizen_flipino")}
                  value={"Filipino"}
                />
                <label htmlFor="citizen_filipino">Filipino</label>
              </div>
              <div className="ml-4 inline-block">
                <input
                  type="checkbox"
                  id="citizen_dual"
                  className="mx-2"
                  {...register("personal_information.p_citizen_dual")}
                  value={"Dual_Citizen"}
                />
                <label htmlFor="citizen_dual">Dual Citizen</label>
              </div>
              <div className="mt-4 inline-block text-right">
                <input
                  type="checkbox"
                  id="citizen_by_birth"
                  className="mx-2"
                  {...register("personal_information.p_citizen_by_birth")}
                  value={"By_Birth"}
                />
                <label htmlFor="citizen_by_birth">by birth</label>
              </div>
              <div className="inline-block">
                <input
                  type="checkbox"
                  id="citizen_by_naturalization"
                  className="mx-2 ml-5"
                  {...register(
                    "personal_information.p_citizen_by_naturalization",
                  )}
                  value={"By_Naturalization"}
                />
                <label htmlFor="citizen_by_naturalization">
                  by naturalization
                </label>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="citizen_indicated"
                  className="block pr-1 text-right"
                >
                  Pls. indicate country:
                </label>
                <input
                  type="text"
                  id="citizen_indicated"
                  className="w-full border-t-2"
                  {...register("personal_information.p_civil_other")}
                />
              </div>
            </div>
          </div>

          <label
            htmlFor="personal_birth_place"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;4. PLACE OF BIRTH
          </label>
          <input
            type="text"
            id="personal_birth_place"
            className="col-span-1 border-2 p-2"
            {...register("personal_information.p_birth_place")}
          />
          <span className="col-span-1 border-2 bg-gray-300 tracking-tighter">
            &nbsp;5. SEX
          </span>
          <div className="col-span-1 flex justify-center gap-4 border-2 p-2">
            <div className="flex gap-1">
              <input
                type="checkbox"
                id="personal_male"
                {...register("personal_information.p_sex_male")}
                value={"Male"}
              />
              <label htmlFor="personal_male">Male</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                id="personal_female"
                {...register("personal_information.p_sex_female")}
                value={"Female"}
              />
              <label htmlFor="personal_female">Female</label>
            </div>
          </div>

          <span className="col-span-1 border-2 bg-gray-300 tracking-tighter">
            &nbsp;6. CIVIL STATUS
          </span>
          <div className="col-span-1 grid grid-cols-2 border-2 p-2">
            <div className="flex gap-1">
              <input
                type="checkbox"
                id="personal_civil_single"
                {...register("personal_information.p_civil_single")}
                value={"Single"}
              />
              <label htmlFor="personal_civil_single">Single</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                id="personal_civil_married"
                {...register("personal_information.p_civil_married")}
                value={"Married"}
              />
              <label htmlFor="personal_civil_married">Married</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                id="personal_civil_widowed"
                {...register("personal_information.p_civil_widowed")}
                value={"Widowed"}
              />
              <label htmlFor="personal_civil_widowed">Widowed</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                id="personal_civil_separated"
                {...register("personal_information.p_civil_separated")}
                value={"Separated"}
              />
              <label htmlFor="personal_civil_separated">Separated</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                id="personal_civil_other"
                {...register("personal_information.p_civil_other")}
                value={"Other_civil"}
              />
              <label htmlFor="personal_civil_other">Other/s:</label>
            </div>
          </div>

          <div className="col-span-3 row-span-3 grid grid-cols-4 grid-rows-5">
            <span className="col-span-1 row-span-4 border-2 border-b-0 bg-gray-300 text-[.7rem] tracking-tighter">
              &nbsp;17. RESIDENTIAL ADDRESS
            </span>
            <div className="col-span-3 row-span-4 grid">
              <div className="relative border-2">
                <input
                  type="text"
                  id="ra_house"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_ra_house")}
                />
                <label
                  htmlFor="ra_house"
                  className="absolute bottom-0 left-15 text-[.7rem]"
                >
                  House/Block/Lot No
                </label>
                <input
                  type="text"
                  id="ra_street"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_ra_street")}
                />
                <label
                  htmlFor="ra_street"
                  className="absolute right-25 bottom-0 text-[.7rem]"
                >
                  Street
                </label>
              </div>
              <div className="relative border-2">
                <input
                  type="text"
                  id="ra_subdivision"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_ra_subdivision")}
                />
                <label
                  htmlFor="ra_subdivision"
                  className="absolute bottom-0 left-15 text-[.7rem]"
                >
                  Subdivision/Village
                </label>
                <input
                  type="text"
                  id="ra_barangay"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_ra_barangay")}
                />
                <label
                  htmlFor="ra_barangay"
                  className="absolute right-25 bottom-0 text-[.7rem]"
                >
                  Barangay
                </label>
              </div>
              <div className="relative border-2">
                <input
                  type="text"
                  id="ra_city"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_ra_city")}
                />
                <label
                  htmlFor="ra_city"
                  className="absolute bottom-0 left-15 text-[.7rem]"
                >
                  City/Municipality
                </label>
                <input
                  type="text"
                  id="ra_province"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_ra_province")}
                />
                <label
                  htmlFor="ra_province"
                  className="absolute right-25 bottom-0 text-[.7rem]"
                >
                  Province
                </label>
              </div>
            </div>
            <label
              htmlFor="ra_zip"
              className="col-span-1 border-2 border-t-0 bg-gray-300 text-center tracking-tighter"
            >
              Zip Code
            </label>
            <input
              type="text"
              id="ra_zip"
              className="col-span-3 border"
              {...register("personal_information.p_ra_zip")}
            />
          </div>

          <label
            htmlFor="personal_height"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;7. HEIGHT (m)
          </label>
          <input
            type="number"
            id="personal_height"
            className="col-span-1 border-2 p-2"
            {...register("personal_information.p_height")}
          />
          <label
            htmlFor="personal_weight"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;8. WEIGHT (kg)
          </label>
          <input
            type="number"
            id="personal_weight"
            className="col-span-1 border-2 p-2"
            {...register("personal_information.p_weight")}
          />

          <label
            htmlFor="personal_blood_type"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;9. BLOOD TYPE
          </label>
          <input
            type="text"
            id="personal_blood_type"
            className="col-span-1 border-2 p-2"
            {...register("personal_information.p_blood_type")}
          />

          <div className="col-span-3 row-span-4 grid grid-cols-4 grid-rows-5">
            <span className="col-span-1 row-span-4 border-2 border-b-0 bg-gray-300 text-[.7rem] tracking-tighter">
              &nbsp;18. PERMANENT ADDRESS
            </span>
            <div className="col-span-3 row-span-4 grid">
              <div className="relative border-2">
                <input
                  type="text"
                  id="pa_house"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_pa_house")}
                />
                <label
                  htmlFor="pa_house"
                  className="absolute bottom-0 left-15 text-[.7rem]"
                >
                  House/Block/Lot No
                </label>
                <input
                  type="text"
                  id="pa_street"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_pa_street")}
                />
                <label
                  htmlFor="pa_street"
                  className="absolute right-25 bottom-0 text-[.7rem]"
                >
                  Street
                </label>
              </div>
              <div className="relative border-2">
                <input
                  type="text"
                  id="pa_subdivision"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_pa_subdivision")}
                />
                <label
                  htmlFor="pa_subdivision"
                  className="absolute bottom-0 left-15 text-[.7rem]"
                >
                  Subdivision/Village
                </label>
                <input
                  type="text"
                  id="pa_barangay"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_pa_barangay")}
                />
                <label
                  htmlFor="pa_barangay"
                  className="absolute right-25 bottom-0 text-[.7rem]"
                >
                  Barangay
                </label>
              </div>
              <div className="relative border-2">
                <input
                  type="text"
                  id="pa_city"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_pa_city")}
                />
                <label
                  htmlFor="pa_city"
                  className="absolute bottom-0 left-15 text-[.7rem]"
                >
                  City/Municipality
                </label>
                <input
                  type="text"
                  id="pa_province"
                  className="w-[50%] border-b-2"
                  {...register("personal_information.p_pa_province")}
                />
                <label
                  htmlFor="pa_province"
                  className="absolute right-25 bottom-0 text-[.7rem]"
                >
                  Province
                </label>
              </div>
            </div>
            <label
              htmlFor="pa_zip"
              className="col-span-1 border-2 border-t-0 bg-gray-300 text-center tracking-tighter"
            >
              Zip Code
            </label>
            <input
              type="text"
              id="pa_zip"
              className="col-span-3 border"
              {...register("personal_information.p_pa_zip")}
            />
          </div>

          <label
            htmlFor="personal_gsis_no"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;10. GSIS ID NO.
          </label>
          <input
            type="text"
            id="personal_gsis_no"
            className="col-span-1 border-2 p-2"
            {...register("personal_information.p_gsis_no")}
          />
          <label
            htmlFor="personal_pagibig_no"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;11. PAG-IBIG ID NO.
          </label>
          <input
            type="text"
            id="personal_pagibig_no"
            className="col-span-1 border-2 p-2"
            {...register("personal_information.p_pagibig_no")}
          />
          <label
            htmlFor="personal_philhealth_no"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;12. PHILHEALTH NO.
          </label>
          <input
            type="text"
            id="personal_philhealth_no"
            className="col-span-1 border-2 p-2"
            {...register("personal_information.p_philhealth_no")}
          />

          <label
            htmlFor="personal_sss_no"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;13. SSS NO.
          </label>
          <input
            type="text"
            id="personal_sss_no"
            className="col-span-1 border-2 p-2"
            {...register("personal_information.p_sss_no")}
          />

          <div className="col-span-3 grid grid-cols-4">
            <label
              htmlFor="personal_telephone"
              className="col-span-1 border-2 bg-gray-300 tracking-tighter"
            >
              &nbsp;19. TELEPHONE NO.
            </label>
            <input
              type="text"
              id="personal_telephone"
              className="col-span-3 border-2 p-2"
              {...register("personal_information.p_telephone")}
            />
          </div>

          <label
            htmlFor="personal_tin_no"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;14. TIN NO.
          </label>
          <input
            type="text"
            id="personal_tin_no"
            className="col-span-1 border-2 p-2"
            {...register("personal_information.p_tin_no")}
          />

          <div className="col-span-3 grid grid-cols-4">
            <label
              htmlFor="personal_mobile"
              className="col-span-1 border-2 bg-gray-300 tracking-tighter"
            >
              &nbsp;20. MOBILE NO.
            </label>
            <input
              type="text"
              id="personal_mobile"
              className="col-span-3 border-2 p-2"
              {...register("personal_information.p_mobile")}
            />
          </div>

          <label
            htmlFor="personal_agency_no"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;15. AGENCY EMPLOYEE NO.
          </label>
          <input
            type="text"
            id="personal_agency_no"
            className="col-span-1 border-2 p-2"
            {...register("personal_information.p_agency_no")}
          />

          <div className="col-span-3 grid grid-cols-4">
            <label
              htmlFor="personal_email"
              className="col-span-1 border-2 bg-gray-300 tracking-tighter"
            >
              &nbsp;21. E-MAIL ADDRESS (if any)
            </label>
            <input
              type="email"
              id="personal_email"
              className="col-span-3 border-2 p-2"
              {...register("personal_information.p_email")}
            />
          </div>
        </div>

        {/* FAMILY BACKGROUND */}
        <div className="border-2">
          <h2 className="bg-gray-600 text-sm font-bold text-white italic">
            II. FAMILY BACKGROUND
          </h2>
        </div>

        <div className="grid grid-cols-5">
          <label
            htmlFor="spouse_surname"
            className="col-span-1 border-2 border-b-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;22. SPOUSE'S SURNAME
          </label>
          <input
            type="text"
            id="spouse_surname"
            className="col-span-2 border-2 p-2"
            {...register("family_background.fb_spouse_surname")}
          />

          <div className="col-span-2 grid grid-cols-3">
            <span className="col-span-2 block border-2 bg-gray-300 text-[.9rem] tracking-tighter">
              &nbsp;23. NAME of CHILDREN <br /> (Write full name and list all)
            </span>
            <span className="col-span-1 border-2 bg-gray-300 text-center tracking-tighter">
              &nbsp;DATE OF BIRTH (mm/dd/yyyy)
            </span>
          </div>

          {/* SPOUSE FIRST NAME */}
          <label
            htmlFor="spouse_first_name"
            className="col-span-1 border-2 border-y-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FIRST NAME
          </label>
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              id="spouse_first_name"
              className="col-span-2 border-2 p-2"
              {...register("family_background.fb_spouse_first_name")}
            />
            <div className="relative col-span-1 border-2 bg-gray-300">
              <label
                htmlFor="spouse_name_extension bg-gray-300"
                className="absolute pl-1 text-[.5rem] tracking-tighter"
              >
                NAME EXTENSION (JR., SR)
              </label>
              <input
                type="text"
                id="spouse_name_extension"
                className="w-full p-2 align-text-bottom"
                {...register("family_background.fb_spouse_name_extension")}
              />
            </div>
          </div>

          {/* FIRST CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="first_child_name"
              {...register("family_background.fb_children_name_1")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="first_child_birth_date"
              {...register("family_background.fb_children_birth_date_1")}
            />
          </div>

          {/* SPOUSE MIDDLE NAME */}
          <label
            htmlFor="spouse_middle_name"
            className="col-span-1 border-2 border-y-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MIDDLE NAME
          </label>
          <input
            type="text"
            id="spouse_middle_name"
            className="col-span-2 border-2 p-2"
            {...register("family_background.fb_spouse_middle_name")}
          />

          {/* SECOND CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="second_child_name"
              {...register("family_background.fb_children_name_2")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="second_child_birth_date"
              {...register("family_background.fb_children_birth_date_2")}
            />
          </div>

          {/* SPOUSE OCCUPATION */}
          <label
            htmlFor="spouse_occupation"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OCCUPATION
          </label>
          <input
            type="text"
            id="spouse_occupation"
            className="col-span-2 border-2 p-2"
            {...register("family_background.fb_spouse_occupation")}
          />

          {/* THIRD CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="third_child_name"
              {...register("family_background.fb_children_name_3")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="third_child_birth_date"
              {...register("family_background.fb_children_birth_date_3")}
            />
          </div>

          {/* SPOUSE EMPLOYER */}
          <label
            htmlFor="spouse_employer"
            className="col-span-1 border-2 bg-gray-300 text-[.9rem] tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;EMPLOYER/BUSINESS NAME
          </label>
          <input
            type="text"
            id="spouse_employer"
            className="col-span-2 border-2 p-2"
            {...register("family_background.fb_spouse_employer")}
          />

          {/* FOURTH CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="fourth_child_name"
              {...register("family_background.fb_children_name_4")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="fourth_child_birth_date"
              {...register("family_background.fb_children_birth_date_4")}
            />
          </div>

          {/* SPOUSE BUSINESS ADDRESS */}
          <label
            htmlFor="spouse_business_address"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BUSINESS ADDRESS
          </label>
          <input
            type="text"
            id="spouse_business_address"
            className="col-span-2 border-2 p-2"
            {...register("family_background.fb_spouse_employer")}
          />

          {/* FIFTH CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="fifth_child_name"
              {...register("family_background.fb_children_name_5")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="fifth_child_birth_date"
              {...register("family_background.fb_children_birth_date_5")}
            />
          </div>

          {/* SPOUSE TELEPHONE */}
          <label
            htmlFor="spouse_telephone"
            className="col-span-1 border-2 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TELEPHONE NO.
          </label>
          <input
            type="text"
            id="spouse_telephone"
            className="col-span-2 border-2 p-2"
            {...register("family_background.fb_spouse_telephone")}
          />

          {/* SIX CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="six_child_name"
              {...register("family_background.fb_children_name_6")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="six_child_birth_date"
              {...register("family_background.fb_children_birth_date_6")}
            />
          </div>

          {/* FATHER SURNAME */}
          <label
            htmlFor="father_surname"
            className="col-span-1 border-2 border-b-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;24. FATHER'S SURNAME
          </label>
          <input
            type="text"
            id="father_surname"
            className="col-span-2 border-2 p-2"
            {...register("family_background.fb_father_surname")}
          />

          {/* SEVEN CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="seven_child_name"
              {...register("family_background.fb_children_name_7")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="seven_child_birth_date"
              {...register("family_background.fb_children_birth_date_7")}
            />
          </div>

          {/* FATHER FIRST NAME */}
          <label
            htmlFor="father_first_name"
            className="col-span-1 border-2 border-y-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FIRST NAME
          </label>
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              id="father_first_name"
              className="col-span-2 border-2 p-2"
              {...register("family_background.fb_father_first_name")}
            />
            <div className="relative col-span-1 border-2 bg-gray-300">
              <label
                htmlFor="father_name_extension"
                className="absolute pl-1 text-[.5rem] tracking-tighter"
              >
                NAME EXTENSION (JR., SR)
              </label>
              <input
                type="text"
                id="father_name_extension"
                className="w-full p-2 align-text-bottom"
                {...register("family_background.fb_father_name_extension")}
              />
            </div>
          </div>

          {/* EIGHT CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="eight_child_name"
              {...register("family_background.fb_children_name_8")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="eight_child_birth_date"
              {...register("family_background.fb_children_birth_date_8")}
            />
          </div>

          {/* FATHER MIDDLE NAME */}
          <label
            htmlFor="father_middle_name"
            className="col-span-1 border-2 border-t-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; MIDDLE NAME
          </label>
          <input
            type="text"
            id="father_middle_name"
            className="col-span-2 border-2 p-2"
            {...register("family_background.fb_father_middle_name")}
          />

          {/* NINE CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="nine_child_name"
              {...register("family_background.fb_children_name_9")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="nine_child_birth_date"
              {...register("family_background.fb_children_birth_date_9")}
            />
          </div>

          {/* MOTHER'S MAIDEN NAME */}
          <label
            htmlFor="mother_maiden_name"
            className="col-span-1 border-2 border-b-0 bg-gray-300 text-[.9rem] tracking-tighter"
          >
            &nbsp;25. MOTHER'S MAIDEN NAME
          </label>
          <input
            type="text"
            id="mother_surname"
            className="col-span-2 border-2 p-2"
            {...register("family_background.fb_mother_maiden_name")}
          />

          {/* TEN CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="ten_child_name"
              {...register("family_background.fb_children_name_10")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="ten_child_birth_date"
              {...register("family_background.fb_children_birth_date_10")}
            />
          </div>

          {/* MOTHER SURNAME */}
          <label
            htmlFor="mother_surname"
            className="col-span-1 border-2 border-y-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SURNAME
          </label>
          <input
            type="text"
            id="mother_surname"
            className="col-span-2 border-2 p-2"
            {...register("family_background.fb_mother_surname")}
          />

          {/* ELEVEN CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="eleven_child_name"
              {...register("family_background.fb_children_name_11")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="eleven_child_birth_date"
              {...register("family_background.fb_children_birth_date_11")}
            />
          </div>

          {/* MOTHER FIRST NAME */}
          <label
            htmlFor="mother_first_name"
            className="col-span-1 border-2 border-y-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FIRST NAME
          </label>
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              id="mother_first_name"
              className="col-span-2 border-2 p-2"
              {...register("family_background.fb_mother_first_name")}
            />
            <div className="relative col-span-1 border-2 bg-gray-300">
              <label
                htmlFor="mother_name_extension"
                className="absolute pl-1 text-[.5rem] tracking-tighter"
              >
                NAME EXTENSION (JR., SR)
              </label>
              <input
                type="text"
                id="mother_name_extension"
                className="w-full p-2 align-text-bottom"
              />
            </div>
          </div>

          {/* TWELVE CHILD INFO */}
          <div className="col-span-2 grid grid-cols-3">
            <input
              type="text"
              className="col-span-2 border-2"
              title="twelve_child_name"
              {...register("family_background.fb_children_name_12")}
            />
            <input
              type="text"
              className="col-span-1 border-2"
              title="twelve_child_birth_date"
              {...register("family_background.fb_children_birth_date_12")}
            />
          </div>

          {/* MOTHER MIDDLE NAME */}
          <label
            htmlFor="mother_middle_name"
            className="col-span-1 border-2 border-t-0 bg-gray-300 tracking-tighter"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; MIDDLE NAME
          </label>
          <input
            type="text"
            id="mother_middle_name"
            className="col-span-2 border-2 p-2"
            {...register("family_background.fb_mother_middle_name")}
          />

          {/* EXTRA INFO IF NECESSARY */}
          <span className="col-span-2 bg-gray-200 py-2 text-center font-bold text-red-500 italic">
            (Continue on separate sheet if necessary)
          </span>
        </div>

        {/* EDUCATIONAL BACKGROUND */}
        <div className="border-2">
          <h2 className="bg-gray-600 text-sm font-bold text-white italic">
            III. EDUCATIONAL BACKGROUND
          </h2>
        </div>

        <div className="grid grid-cols-5">
          <span className="relative col-span-1 border-2 border-t-0 bg-gray-300 text-center tracking-tighter">
            <span className="absolute top-0 left-0">26.</span>
            LEVEL
          </span>
          <span className="col-span-1 border-2 border-t-0 bg-gray-300 text-center tracking-tighter">
            NAME OF SCHOOL
            <span className="block">(Write in full)</span>
          </span>
          <span className="col-span-1 border-2 border-t-0 bg-gray-300 text-center text-[.8rem] tracking-tighter">
            BASIC EDUCATION/DEGREE/COURSE
            <span className="block">(Write in full)</span>
          </span>

          <div className="col-span-2 grid grid-cols-5">
            <div className="col-span-2 grid grid-cols-2 grid-rows-2">
              <span className="col-span-2 row-span-1 border-b-2 bg-gray-300 text-center text-[.7rem]">
                PERIOD OF ATTENDANCE
              </span>
              <span className="col-span-1 row-span-1 border-r-2 bg-gray-300 text-center text-[.7rem]">
                FROM
              </span>
              <span className="col-span-1 row-span-1 bg-gray-300 text-center text-[.7rem]">
                TO
              </span>
            </div>

            <span className="col-span-1 border-x-2 bg-gray-300 text-center text-[.7rem]">
              HIGHEST LEVEL/ UNITS EARNED
            </span>
            <span className="col-span-1 border-r-2 bg-gray-300 text-center text-[.7rem]">
              YEAR GRADUATED
            </span>
            <span className="col-span-1 bg-gray-300 text-center text-[.7rem]">
              SCHOLARSHIP/ ACADEMIC HONORS RECEIVED
            </span>
          </div>

          <span className="relative col-span-1 border-2 border-t-0 bg-gray-300 text-center tracking-tighter">
            ELEMENTARY
          </span>
          <input
            type="text"
            title="e_school_name"
            className="col-span-1 border-2"
            {...register("educational_background.eb_e_school_name")}
          />
          <input
            type="text"
            title="e_basic_education"
            className="col-span-1 border-2"
            {...register("educational_background.eb_e_basic_education")}
          />

          <div className="col-span-2 grid grid-cols-5">
            <div className="col-span-2 grid grid-cols-2">
              <input
                type="text"
                title="e_pa_from"
                className="col-span-1 border-2"
                {...register("educational_background.eb_e_period_from")}
              />
              <input
                type="text"
                title="e_pa_to"
                className="col-span-1 border-2"
                {...register("educational_background.eb_e_period_to")}
              />
            </div>

            <input
              type="text"
              title="e_earned"
              className="col-span-1 border-2"
            />
            <input
              type="text"
              title="e_year_graduated"
              className="col-span-1 border-2"
              {...register("educational_background.eb_e_year_graduated")}
            />
            <input
              type="text"
              title="e_honor_received"
              className="col-span-1 border-2"
              {...register("educational_background.eb_e_honor_received")}
            />
          </div>

          <span className="relative col-span-1 border-2 border-t-0 bg-gray-300 text-center tracking-tighter">
            SECONDARY
          </span>
          <input
            type="text"
            title="s_school_name"
            className="col-span-1 border-2"
            {...register("educational_background.eb_s_school_name")}
          />
          <input
            type="text"
            title="s_basic_education"
            className="col-span-1 border-2"
            {...register("educational_background.eb_s_basic_education")}
          />

          <div className="col-span-2 grid grid-cols-5">
            <div className="col-span-2 grid grid-cols-2">
              <input
                type="text"
                title="s_pa_from"
                className="col-span-1 border-2"
                {...register("educational_background.eb_s_period_from")}
              />
              <input
                type="text"
                title="s_pa_to"
                className="col-span-1 border-2"
                {...register("educational_background.eb_s_period_to")}
              />
            </div>

            <input
              type="text"
              title="e_earned"
              className="col-span-1 border-2"
              {...register("educational_background.eb_s_units_earned")}
            />
            <input
              type="text"
              title="s_year_graduated"
              className="col-span-1 border-2"
              {...register("educational_background.eb_s_year_graduated")}
            />
            <input
              type="text"
              title="s_honor_received"
              className="col-span-1 border-2"
              {...register("educational_background.eb_s_honor_received")}
            />
          </div>

          {/* VOCATIONAL */}
          <span className="relative col-span-1 border-2 border-t-0 bg-gray-300 text-center tracking-tighter">
            VOCATIONAL / TRADE COURSE
          </span>
          <input
            type="text"
            title="v_school_name"
            className="col-span-1 border-2"
            {...register("educational_background.eb_v_school_name")}
          />
          <input
            type="text"
            title="v_basic_education"
            className="col-span-1 border-2"
            {...register("educational_background.eb_v_basic_education")}
          />

          <div className="col-span-2 grid grid-cols-5">
            <div className="col-span-2 grid grid-cols-2">
              <input
                type="text"
                title="v_pa_from"
                className="col-span-1 border-2"
                {...register("educational_background.eb_v_period_from")}
              />
              <input
                type="text"
                title="v_pa_to"
                className="col-span-1 border-2"
                {...register("educational_background.eb_v_period_from")}
              />
            </div>

            <input
              type="text"
              title="e_earned"
              className="col-span-1 border-2"
              {...register("educational_background.eb_v_units_earned")}
            />
            <input
              type="text"
              title="v_year_graduated"
              className="col-span-1 border-2"
              {...register("educational_background.eb_v_year_graduated")}
            />
            <input
              type="text"
              title="v_honor_received"
              className="col-span-1 border-2"
              {...register("educational_background.eb_v_honor_received")}
            />
          </div>

          {/* COLLEGE */}
          <span className="relative col-span-1 border-2 border-t-0 bg-gray-300 text-center tracking-tighter">
            COLLEGE
          </span>
          <input
            type="text"
            title="c_school_name"
            className="col-span-1 border-2"
            {...register("educational_background.eb_c_school_name")}
          />
          <input
            type="text"
            title="c_basic_education"
            className="col-span-1 border-2"
            {...register("educational_background.eb_c_basic_education")}
          />

          <div className="col-span-2 grid grid-cols-5">
            <div className="col-span-2 grid grid-cols-2">
              <input
                type="text"
                title="c_pa_from"
                className="col-span-1 border-2"
                {...register("educational_background.eb_c_period_from")}
              />
              <input
                type="text"
                title="c_pa_to"
                className="col-span-1 border-2"
                {...register("educational_background.eb_c_period_to")}
              />
            </div>

            <input
              type="text"
              title="e_earned"
              className="col-span-1 border-2"
            />
            <input
              type="text"
              title="c_year_graduated"
              className="col-span-1 border-2"
              {...register("educational_background.eb_c_year_graduated")}
            />
            <input
              type="text"
              title="c_honor_received"
              className="col-span-1 border-2"
              {...register("educational_background.eb_c_honor_received")}
            />
          </div>

          {/* GRADUATE STUDIES */}
          <span className="relative col-span-1 border-2 border-t-0 bg-gray-300 text-center tracking-tighter">
            GRADUATE STUDIES
          </span>
          <input
            type="text"
            title="ga_school_name"
            className="col-span-1 border-2"
            {...register("educational_background.eb_gs_school_name")}
          />
          <input
            type="text"
            title="ga_basic_education"
            className="col-span-1 border-2"
            {...register("educational_background.eb_gs_basic_education")}
          />

          <div className="col-span-2 grid grid-cols-5">
            <div className="col-span-2 grid grid-cols-2">
              <input
                type="text"
                title="ga_pa_from"
                className="col-span-1 border-2"
                {...register("educational_background.eb_gs_period_from")}
              />
              <input
                type="text"
                title="ga_pa_to"
                className="col-span-1 border-2"
                {...register("educational_background.eb_gs_period_to")}
              />
            </div>

            <input
              type="text"
              title="e_earned"
              className="col-span-1 border-2"
              {...register("educational_background.eb_gs_units_earned")}
            />
            <input
              type="text"
              title="ga_year_graduated"
              className="col-span-1 border-2"
              {...register("educational_background.eb_gs_year_graduated")}
            />
            <input
              type="text"
              title="ga_honor_received"
              className="col-span-1 border-2"
              {...register("educational_background.eb_gs_honor_received")}
            />
          </div>

          <span className="col-span-5 border-2 border-black bg-gray-200 text-center text-[.7rem] font-bold text-red-500 italic">
            (Continue on separate sheet if necessary)
          </span>

          {/* SIGNATURE */}
          <label
            htmlFor="eb_signature"
            className="col-span-1 border-2 bg-gray-300 text-center font-bold"
          >
            SIGNATURE
          </label>
          <input
            type="text"
            id="eb_signature"
            className="col-span-2 border-2"
          />

          {/* SIGNATURE DATE */}
          <label
            htmlFor="eb_signature_date"
            className="col-span-1 border-2 bg-gray-300 text-center font-bold"
          >
            DATE
          </label>
          <input
            type="text"
            id="eb_signature_date"
            className="col-span-1 border-2"
          />
        </div>
      </form>

      <div className="relative bottom-15 mx-auto flex h-full w-[1001px] items-end justify-end p-4">
        <div className="relative flex flex-col items-end gap-4">
          <p className="text-sm text-white italic">
            CS FORM 212 (Revised 2017), Page 1 of 4
          </p>
          <div>
            <button
              type="button"
              className="absolute top-10 right-[-20px] flex cursor-pointer items-center gap-2 rounded-full bg-green-500 p-4 hover:bg-green-300"
              onClick={() => navigate("/form/2")}
            >
              <span className="font-semibold text-white">Next</span>
              <img src={arrow} alt="arrow-right" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormOne;
