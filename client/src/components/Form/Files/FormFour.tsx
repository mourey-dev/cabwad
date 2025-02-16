import arrow from "../../../assets/images/right-arrow.png";

import { useForm } from "react-hook-form";

const FormFour = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <form
        className="mx-auto my-12 grid h-full w-[1001px] border-4 bg-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-5">
          <span className="col-span-3 border-2 border-b-0 bg-gray-300 pl-2">
            34. Are you related by consanguinity or affinity to the appointing
            or recommending authority, or to chief of bureau or office or to the
            person who has immediate supervision over you in the Bureau or
            Department where you will be apppointed,
          </span>
          <div className="col-span-2 border-2 border-b-0"></div>

          {/* THIRD DEGREE */}
          <span className="col-span-3 border-2 border-y-0 bg-gray-300 pl-2">
            a. within the third degree?
          </span>
          <div className="col-span-2 flex gap-12 border-2 border-y-0 pl-4">
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_third_degree_yes"
                {...register("of_third_degree_yes")}
              />
              <label htmlFor="of_third-degree_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_third_degree_no"
                {...register("of_third_degree_no")}
              />
              <label htmlFor="of_third_degree_no">NO</label>
            </div>
          </div>

          {/* THIRD DEGREE */}
          <span className="col-span-3 border-2 border-t-0 bg-gray-300 pl-2">
            b. within the fourth degree (for Local Government Unit - Career
            Employees)?
          </span>
          <div className="col-span-2 flex flex-wrap items-center border-2 border-t-0 px-4 pb-1">
            <div className="mr-12 flex gap-1">
              <input
                type="checkbox"
                title="of_third_degree_yes"
                {...register("of_third_degree_yes")}
              />
              <label htmlFor="of_third-degree_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_third_degree_no"
                {...register("of_third_degree_no")}
              />
              <label htmlFor="of_third_degree_no">NO</label>
            </div>
            <label htmlFor="of_if_yes" className="w-full">
              If YES, give details:
            </label>
            <input
              type="text"
              id="of_if_yes"
              className="w-full border-b-2"
              {...register("of_if_yes")}
            />
          </div>

          {/* QUESTION 35 */}
          <span className="col-span-3 border-2 border-b-0 bg-gray-300 pl-2">
            35. a. Have you ever been found guilty of any administrative
            offense?
          </span>
          <div className="col-span-2 flex flex-wrap items-center border-2 border-t-0 px-4 pb-1">
            <div className="mr-12 flex gap-1">
              <input
                type="checkbox"
                title="of_third_degree_yes"
                {...register("of_third_degree_yes")}
              />
              <label htmlFor="of_third-degree_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_third_degree_no"
                {...register("of_third_degree_no")}
              />
              <label htmlFor="of_third_degree_no">NO</label>
            </div>
            <label htmlFor="of_if_yes" className="w-full">
              If YES, give details:
            </label>
            <input
              type="text"
              id="of_if_yes"
              className="w-full border-b-2"
              {...register("of_if_yes")}
            />
          </div>

          <span className="col-span-3 border-2 border-t-0 bg-gray-300 pl-2">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; b. Have you been criminally charged
            before any court?
          </span>
          <div className="col-span-2 flex flex-wrap items-center border-2 border-t-0 px-4 pb-1">
            <div className="mr-12 flex gap-1">
              <input
                type="checkbox"
                title="of_third_degree_yes"
                {...register("of_third_degree_yes")}
              />
              <label htmlFor="of_third-degree_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_third_degree_no"
                {...register("of_third_degree_no")}
              />
              <label htmlFor="of_third_degree_no">NO</label>
            </div>
            <span className="w-full">If YES, give details:</span>
            <div className="flex w-full gap-4">
              <label htmlFor="of_charged_before_date_filled">Date Filed:</label>
              <input
                type="text"
                id="of_charged_before_date_filled"
                className="flex-1 border-b-2"
                {...register("of_charged_before_date_filled")}
              />
            </div>
            <div className="flex w-full gap-4">
              <label htmlFor="of_charged_before_status">
                Date Status of Case/s:
              </label>
              <input
                type="text"
                id="of_charged_before_status"
                className="flex-1 border-b-2"
                {...register("of_charged_before_status")}
              />
            </div>
          </div>

          {/* QUESTION 36 */}
          <span className="col-span-3 border-2 border-b-0 bg-gray-300 pl-2">
            36. Have you ever been convicted of any crime or violation of any
            law, decree, ordinance or regulation by any court or tribunal?
          </span>
          <div className="col-span-2 flex flex-wrap items-center border-2 border-t-0 px-4 pb-1">
            <div className="mr-12 flex gap-1">
              <input
                type="checkbox"
                title="of_convicted_yes"
                {...register("of_convicted_yes")}
              />
              <label htmlFor="of_convicted_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_convicted_no"
                {...register("of_convicted_no")}
              />
              <label htmlFor="of_convicted_no">NO</label>
            </div>
            <label htmlFor="of_if_convicted_yes" className="w-full">
              If YES, give details:
            </label>
            <input
              type="text"
              id="of_if_convicted_yes"
              className="w-full border-b-2"
              {...register("of_if_convicted_yes")}
            />
          </div>

          {/* QUESTION 37 */}
          <span className="col-span-3 border-2 border-b-0 bg-gray-300 pl-2">
            37. Have you ever been separated from the service in any of the
            following modes: resignation, retirement, dropped from the rolls,
            dismissal, termination, end of term, finished contract or phased out
            (abolition) in the public or private sector?
          </span>
          <div className="col-span-2 flex flex-wrap items-center border-2 border-t-0 px-4 pb-1">
            <div className="mr-12 flex gap-1">
              <input
                type="checkbox"
                title="of_dismissal"
                {...register("of_dismissal")}
              />
              <label htmlFor="of_dismissal_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_dismissal_no"
                {...register("of_dismissal_no")}
              />
              <label htmlFor="of_dismissal_no">NO</label>
            </div>
            <label htmlFor="of_if_dismissal_yes" className="w-full">
              If YES, give details:
            </label>
            <input
              type="text"
              id="of_if_dismissal_yes"
              className="w-full border-b-2"
              {...register("of_if_dismissal_yes")}
            />
          </div>

          {/* QUESTION 38 */}
          <span className="col-span-3 border-2 border-b-0 bg-gray-300 pl-2">
            38. a. Have you ever been a candidate in a national or local
            election held within the last year (except Barangay election)?
          </span>
          <div className="col-span-2 flex flex-wrap items-center border-2 border-b-0 px-4 pb-1">
            <div className="mr-12 flex gap-1">
              <input
                type="checkbox"
                title="of_local_candidate_yes"
                {...register("of_local_candidate_yes")}
              />
              <label htmlFor="of_local_candidate_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_local_candidate_no"
                {...register("of_local_candidate_no")}
              />
              <label htmlFor="of_local_candidate_no">NO</label>
            </div>
            <div className="flex w-full gap-4">
              <label htmlFor="of_if_local_candidate_yes">
                If YES, give details:
              </label>
              <input
                type="text"
                id="of_if_local_candidate_yes"
                className="flex-1 border-b-2"
                {...register("of_if_local_candidate_yes")}
              />
            </div>
          </div>

          <span className="col-span-3 border-2 border-t-0 bg-gray-300 pl-2">
            b. Have you resigned from the government service during the three
            (3)-month period before the last election to promote/actively
            campaign for a national or local candidate?
          </span>
          <div className="col-span-2 flex flex-wrap items-center border-2 border-t-0 px-4 pb-1">
            <div className="mr-12 flex gap-1">
              <input
                type="checkbox"
                title="of_government_resign_yes"
                {...register("of_government_resign_yes")}
              />
              <label htmlFor="of_government_resign_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_government_resign_no"
                {...register("of_government_resign_no")}
              />
              <label htmlFor="of_government_resign_no">NO</label>
            </div>
            <div className="flex w-full gap-4">
              <label htmlFor="of_if_government_resign_yes">
                If YES, give details:
              </label>
              <input
                type="text"
                id="of_if_government_resign_yes"
                className="flex-1 border-b-2"
                {...register("of_if_government_resign_yes")}
              />
            </div>
          </div>

          {/* QUESTION 39 */}
          <span className="col-span-3 border-2 border-b-0 bg-gray-300 pl-2">
            39. Have you acquired the status of an immigrant or permanent
            resident of another country?
          </span>
          <div className="col-span-2 flex flex-wrap items-center border-2 border-t-0 px-4 pb-1">
            <div className="mr-12 flex gap-1">
              <input
                type="checkbox"
                title="of_acquired_immigrant_yes"
                {...register("of_acquired_immigrant_yes")}
              />
              <label htmlFor="of_acquired_immigrant_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_acquired_immigrant_no"
                {...register("of_acquired_immigrant_no")}
              />
              <label htmlFor="of_acquired_immigrant_no">NO</label>
            </div>
            <label htmlFor="of_if_acquired_immigrant_yes" className="w-full">
              If YES, give details:
            </label>
            <input
              type="text"
              id="of_if_acquired_immigrant_yes"
              className="w-full border-b-2"
              {...register("of_if_acquired_immigrant_yes")}
            />
          </div>

          {/* QUESTION 40 */}
          <span className="col-span-3 border-2 border-b-0 bg-gray-300 pl-2">
            40. Pursuant to: (a) Indigenous People's Act (RA 8371); (b) Magna
            Carta for Disabled Persons (RA 7277); and (c) Solo Parents Welfare
            Act of 2000 (RA 8972), please answer the following
          </span>
          <div className="col-span-2 border-2 border-b-0"></div>

          <span className="col-span-3 border-2 border-y-0 bg-gray-300 pl-2">
            a. Are you a member of any indigenous group?
          </span>
          <div className="col-span-2 flex flex-wrap items-center border-2 border-y-0 px-4 pb-1">
            <div className="mr-12 flex gap-1">
              <input
                type="checkbox"
                title="of_indigenous_yes"
                {...register("of_indigenous_yes")}
              />
              <label htmlFor="of_indigenous_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_indigenous_no"
                {...register("of_indigenous_no")}
              />
              <label htmlFor="of_indigenous_no">NO</label>
            </div>
            <div className="flex w-full gap-4">
              <label htmlFor="of_if_indigenous_yes">
                If YES, give details:
              </label>
              <input
                type="text"
                id="of_if_indigenous_yes"
                className="flex-1 border-b-2"
                {...register("of_if_indigenous_yes")}
              />
            </div>
          </div>

          <span className="col-span-3 border-2 border-y-0 bg-gray-300 pl-2">
            b. Are you a person with disability?
          </span>
          <div className="col-span-2 flex flex-wrap items-center border-2 border-y-0 px-4 pb-1">
            <div className="mr-12 flex gap-1">
              <input
                type="checkbox"
                title="of_disability_yes"
                {...register("of_disability_yes")}
              />
              <label htmlFor="of_disability_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_disability_no"
                {...register("of_disability_no")}
              />
              <label htmlFor="of_disability_no">NO</label>
            </div>
            <div className="flex w-full gap-4">
              <label htmlFor="of_if_disability_yes">
                If YES, give details:
              </label>
              <input
                type="text"
                id="of_if_disability_yes"
                className="flex-1 border-b-2"
                {...register("of_if_disability_yes")}
              />
            </div>
          </div>

          <span className="col-span-3 border-2 border-t-0 bg-gray-300 pl-2">
            c. Are you a solo parent?
          </span>
          <div className="col-span-2 flex flex-wrap items-center border-2 border-t-0 px-4 pb-1">
            <div className="mr-12 flex gap-1">
              <input
                type="checkbox"
                title="of_solo_parent_yes"
                {...register("of_solo_parent_yes")}
              />
              <label htmlFor="of_solo_parent_yes">YES</label>
            </div>
            <div className="flex gap-1">
              <input
                type="checkbox"
                title="of_solo_parent_no"
                {...register("of_solo_parent_no")}
              />
              <label htmlFor="of_solo_parent_no">NO</label>
            </div>
            <div className="flex w-full gap-4">
              <label htmlFor="of_if_solo_parent_yes">
                If YES, give details:
              </label>
              <input
                type="text"
                id="of_if_solo_parent_yes"
                className="flex-1 border-b-2"
                {...register("of_if_solo_parent_yes")}
              />
            </div>
          </div>

          <span className="col-span-4 border-2 bg-gray-300 pl-2">
            41. REFERENCES{" "}
            <span className="text-red-600">
              (Person not related by consanguinity or affinity to applicant
              /appointee)
            </span>
          </span>

          <div className="col-span-4 grid grid-cols-4">
            <span className="col-span-2 border-2 text-center">NAME</span>
            <span className="col-span-1 border-2 text-center">ADDRESS</span>
            <span className="col-span-1 border-2 text-center">TEL. NO.</span>

            {/* FIRST REFERENCE */}
            <input
              type="text"
              title="reference_name_1"
              className="col-span-2 border-2"
              {...register("reference_name_1")}
            />
            <input
              type="text"
              title="reference_address_1"
              className="col-span-1 border-2"
              {...register("reference_address_1")}
            />
            <input
              type="text"
              title="reference_telephone_1"
              className="col-span-1 border-2"
              {...register("reference_telephone_1")}
            />

            {/* SECOND REFERENCE */}
            <input
              type="text"
              title="reference_name_2"
              className="col-span-2 border-2"
              {...register("reference_name_2")}
            />
            <input
              type="text"
              title="reference_address_2"
              className="col-span-1 border-2"
              {...register("reference_address_2")}
            />
            <input
              type="text"
              title="reference_telephone_2"
              className="col-span-1 border-2"
              {...register("reference_telephone_2")}
            />

            {/* THIRD REFERENCE */}
            <input
              type="text"
              title="reference_name_3"
              className="col-span-2 border-2"
              {...register("reference_name_3")}
            />
            <input
              type="text"
              title="reference_address_3"
              className="col-span-1 border-2"
              {...register("reference_address_3")}
            />
            <input
              type="text"
              title="reference_telephone_3"
              className="col-span-1 border-2"
              {...register("reference_telephone_3")}
            />
          </div>

          <div className="col-span-1">
            <div className="mx-auto h-50 w-40 border-2 p-4">
              <span className="block text-center text-[.6rem] tracking-tighter">
                ID picture taken within the last 6 months 3.5 cm. X 4.5 cm
                (passport size)
              </span>
              <span className="my-4 block text-center text-[.6rem] tracking-tighter">
                With full and handwritten name tag and signature over printed
                name
              </span>
              <span className="block text-center text-[.6rem] tracking-tighter">
                Computer generated or photocopied picture is not acceptable
              </span>
            </div>
            <span className="block text-center text-slate-400">PHOTO</span>
            <input
              type="file"
              accept="image/*"
              title="profile"
              className="hidden"
              {...register("profile")}
            />
          </div>

          <span className="col-span-4 border-2 bg-gray-300 p-2 text-justify tracking-tighter">
            42. I declare under oath that I have personally accomplished this
            Personal Data Sheet which is a true, correct and complete statement
            pursuant to the provisions of pertinent laws, rules and regulations
            of the Republic of the Philippines. I authorize the agency
            head/authorized representative to verify/validate the contents
            stated herein. I agree that any misrepresentation made in this
            document and its attachments shall cause the filing of
            administrative/criminal case/s against me.
          </span>

          <div className="col-span-5 flex justify-between p-4">
            <div className="w-[300px] border-2">
              {/* GOVERNMENT ISSUED ID */}
              <span className="block border-b-2 bg-gray-300 p-1 text-[.7rem]">
                Government Issued ID{" "}
                <span className="text-[.5rem]">
                  (i.e.Passport, GSIS, SSS, PRC, Driver's License, etc.)
                </span>{" "}
                PLEASE INDICATE ID Number and Date of Issuance
              </span>
              <div className="flex gap-2 border-b-2 p-1">
                <label htmlFor="gov_issued_id" className="text-[.7rem]">
                  Government Issued ID:{" "}
                </label>
                <input
                  type="text"
                  id="gov_issued_id"
                  className="flex-1 text-[.7rem]"
                  {...register("gov_issued_id")}
                />
              </div>

              {/* ID NO */}
              <div className="flex gap-2 border-b-2 p-1">
                <label htmlFor="id_no" className="text-[.7rem]">
                  ID/License/Passport No.:{" "}
                </label>
                <input
                  type="text"
                  id="id_no"
                  className="flex-1 text-[.7rem]"
                  {...register("id_no")}
                />
              </div>

              {/* DATE ISSUANCE */}
              <div className="flex gap-2 p-1">
                <label htmlFor="date_issuance" className="text-[.7rem]">
                  Date/Place of Issuance:{" "}
                </label>
                <input
                  type="text"
                  id="date_issuance"
                  className="flex-1 text-[.7rem]"
                  {...register("date_issuance")}
                />
              </div>
            </div>

            <div className="w-[300px] border-2">
              <div className="h-20"></div>
              <span className="block border-y-2 bg-gray-300 text-center text-[.7rem]">
                Signature (Sign inside the box)
              </span>
              <span className="block"> </span>
              <span className="block bg-gray-300 text-center text-[.7rem]">
                Date Accomplished
              </span>
            </div>

            <div className="w-[200px] border-2">
              <div className="h-26"></div>
              <span className="block border-t-2 bg-gray-300 text-center text-[.7rem]">
                Right Thumbmark
              </span>
            </div>
          </div>

          <div className="col-span-5 border-2 p-4">
            <div>
              <span>SUBSCRIBED AND SWORN to before me this </span>
              <input
                type="text"
                title="sworn"
                className="border-b-2"
                {...register("sworn")}
              />
              <span>
                , affiant exhibiting his/her validly issued government ID as
                indicated above.
              </span>
            </div>

            <div className="mx-auto mt-8 w-[300px] border-2">
              <div className="h-20"></div>
              <span className="block border-t-2 bg-gray-300 text-center">
                Person Administering Oath
              </span>
            </div>
          </div>
        </div>
      </form>

      <div className="relative flex h-full items-end justify-end p-4">
        <div className="flex items-center gap-4">
          <p className="text-sm text-white italic">
            CS FORM 212 (Revised 2017), Page 4 of 4
          </p>
          <button className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-500 p-4">
            <span className="font-semibold text-white">Next</span>
            <img src={arrow} alt="arrow-right" className="h-5 w-5" />
          </button>

          <button className="rounded-full bg-yellow-500 px-7 py-4 text-white hover:bg-yellow-400">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormFour;
