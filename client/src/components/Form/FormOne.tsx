const FormOne = () => {
  return (
    <div className="mx-auto mt-12 grid w-[850px] border-2">
      {/* First Grid Row */}
      <div className="1fr relative">
        <div className="absolute flex flex-col">
          <span className="text-[.8rem] font-bold italic">CS Form No. 212</span>
          <span className="text-[.7rem] font-bold italic">Revised 2017</span>
        </div>

        <h1 className="mt-4 text-center text-3xl font-extrabold">
          PERSONAL DATA SHEET
        </h1>

        <div>
          <p className="mt-2 text-[.7rem] font-bold tracking-tight italic">
            WARNING: Any misinterpretation made in the Personal Data Sheet and
            the Work Experience Sheet shall cause the filing of
            administrative/criminal case/s against the person concerned.
          </p>
          <p className="text-[.7rem] font-bold tracking-tight italic">
            READ THE ATTACHED GUIDE TO FILLING OUT THE PERSONAL DATA SHEET (PDS)
            BEFORE ACCOMPLISHING THE PDS FORM.
          </p>
          <div>
            <div className="flex">
              <div className="flex items-center gap-1">
                <span className="text-[.7rem]">
                  Print legibly. Tick appropriate boxes
                </span>
                <div className="ml- h-3 w-3 border-[1px]"></div>
                <span className="text-[.7rem]">
                  ) and use separate sheet if necessary. Indicate N/A if not
                  applicable.{" "}
                </span>
              </div>

              <div className="flex pl-[2px]">
                <span className="px-1 text-[.7rem] font-bold">
                  DO NOT ABBREVIATE.
                </span>
                <span className="border-2 text-[.6rem] tracking-tighter">
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
        <h2 className="bg-gray-400 text-xs font-bold text-white italic">
          I. PERSONAL INFORMATION
        </h2>
      </div>

      <div className="grid grid-cols-4">
        <label
          htmlFor="personal_surname"
          className="col-span-1 border-2 border-b-0 tracking-tighter"
        >
          &nbsp;2. SURNAME
        </label>
        <input
          type="text"
          id="personal_first_name"
          className="col-span-3 border-2 p-2"
        />
        <label
          htmlFor="personal_first_name"
          className="col-span-1 border-2 border-y-0 tracking-tighter"
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FIRST NAME
        </label>
        <input
          type="text"
          id="personal_surname"
          className="col-span-2 border-2 p-2"
        />
        <div className="relative border-2">
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
          />
        </div>
        <label
          htmlFor="personal_last_name"
          className="col-span-1 border-2 border-t-0 tracking-tighter"
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LASTNAME
        </label>
        <input
          type="text"
          id="personal_last_name"
          className="col-span-3 border-2 p-2"
        />
        <label
          htmlFor="personal_last_name"
          className="col-span-1 border-2 tracking-tighter"
        >
          &nbsp;3. DATE OF BIRTH
          <span className="block text-[.9rem]">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(mm/dd/yyyy)
          </span>
        </label>
        <input
          type="text"
          id="personal_last_name"
          className="col-span-1 border-2 p-2"
        />

        <div className="col-span-2 row-span-3 grid grid-cols-3 border-2">
          <div className="col-span-1 border-r-2">
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
              <input type="checkbox" id="citizen_filipino" className="mx-2" />
              <label htmlFor="citizen_filipino">Filipino</label>
            </div>
            <div className="ml-4 inline-block">
              <input type="checkbox" id="citizen_dual" className="mx-2" />
              <label htmlFor="citizen_dual">Dual Citizen</label>
            </div>
            <div className="mt-4 inline-block text-right">
              <input type="checkbox" id="citizen_by_birth" className="mx-2" />
              <label htmlFor="citizen_by_birth">by birth</label>
            </div>
            <div className="inline-block">
              <input
                type="checkbox"
                id="citizen_by_naturalization"
                className="mx-2 ml-5"
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
              />
            </div>
          </div>
        </div>

        <label
          htmlFor="personal_birth_place"
          className="col-span-1 border-2 tracking-tighter"
        >
          &nbsp;3. PLACE OF BIRTH
        </label>
        <input
          type="text"
          id="personal_birth_place"
          className="col-span-1 border-2 p-2"
        />
        <span className="col-span-1 border-2 tracking-tighter">
          &nbsp;3. SEX
        </span>
        <div className="col-span-1 flex justify-center gap-4 border-2 p-2">
          <div className="flex gap-1">
            <input type="checkbox" id="personal_male" />
            <label htmlFor="personal_male">Male</label>
          </div>
          <div className="flex gap-1">
            <input type="checkbox" id="personal_female" />
            <label htmlFor="personal_female">Female</label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormOne;
