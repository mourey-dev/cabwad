const Form = () => {
  return (
    <form className="w-[80%] mx-auto border-2 mt-8">
      <div className="border-b-2">
        <div className="flex flex-col">
          <span className="italic font-bold">CS Form No. 212</span>
          <span className="italic text-[.75rem] font-bold">Revised 2017</span>
        </div>
        <div>
          <h1 className="uppercase font-bold text-3xl text-center">
            Personal Data Sheet
          </h1>
        </div>
        <div>
          <p className="font-bold">
            WARNING: Any misrepresentation made in the Personal Data Sheet and
            the Work Experience Sheet shall cause the filing of
            administrative/criminal case/s against the person concerned.
          </p>
          <p className="font-bold">
            READ THE ATTACHED GUIDE TO FILLING OUT THE PERSONAL DATA SHEET (PDS)
            BEFORE ACCOMPLISHING THE PDS FORM.
          </p>
          <div className="flex">
            <p className=" flex items-center">
              Print legibly. Tick appropriate boxes{" "}
              <div className="border-[1px] w-2 h-2 mx-1"></div> and use separate
              sheet if necessary. Indicate N/A if not applicable.{" "}
              <span className="font-bold">DO NOT ABBREVIATE.</span>
            </p>
            <div className="flex grow-1">
              <label htmlFor="csc" className="flex-none border-2 ml-2 pr-1">
                1. CS ID no.
              </label>
              <input
                type="text"
                id="csc"
                placeholder="(Do not fill up. For CSC use only)"
                className="border-2 grow outline-0 border-x-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold uppercase">I. Personal Information</h3>
        <div className="flex col">
          <label htmlFor="surname" className="uppercase w-40 border-t-2">
            1. Surname
          </label>
          <input
            id="surname"
            type="text"
            className="border-2 grow border-r-0 border-b-0"
          />
        </div>
        <div className="flex col">
          <label htmlFor="first_name" className="uppercase w-40 pl-4">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            className="border-2 grow border-b-0"
          />
          <div className="relative">
            <label
              htmlFor="name_extension"
              className="uppercase absolute text-[.5rem] bg-transparent left-0.5"
            >
              Name Extension (JR., SR)
            </label>
            <input
              type="text"
              id="name_extension"
              className="border-t-2 outline-0 text-[.9rem] h-full"
            />
          </div>
        </div>
        <div className="flex col border-b-2">
          <label htmlFor="middle_name" className="uppercase w-40 pl-4">
            Middle Name
          </label>
          <input
            type="text"
            id="middle_name"
            className="border-2 grow border-r-0 border-b-0"
          />
        </div>
      </div>

      <div className="flex">
        <div className="grow">
          <div className="flex">
            <div className="border-2 w-[10.1em] border-l-0 border-t-0">
              <label htmlFor="birth_date" className="uppercase">
                Date of Birth
              </label>
              <span className="block">(mm/dd/yy)</span>
            </div>
            <input
              type="text"
              id="birth_date"
              className="border-b-2 border-r-2 w-full"
            />
          </div>
          <div className="flex">
            <label
              htmlFor="birth_place"
              className="uppercase border-r-2 block w-[10.1em] border-b-2"
            >
              Place of Birth
            </label>
            <input
              type="text"
              id="birth_place"
              className="border-b-2 border-r-2 w-full"
            />
          </div>
          <div className="flex">
            <label
              htmlFor="sex"
              className="uppercase border-r-2 block w-[10.1em] border-b-2"
            >
              Sex
            </label>
            <div className="flex gap-4 justify-center w-full">
              <div className="flex">
                <input type="checkbox" id="male" />
                <label htmlFor="male">Male</label>
              </div>
              <div className="flex">
                <input type="checkbox" id="female" />
                <label htmlFor="female">Female</label>
              </div>
            </div>
          </div>
        </div>

        <div className="grow-2">
          <div>
            <label htmlFor="citizenship">Citizenchip</label>
            <span>If holder of dual citizenship.</span>
            <span>please indicate the details.</span>
          </div>
          <div>
            <div>
              <label htmlFor="filipino">Filipino</label>
              <input type="checkbox" id="filipino" />
            </div>
            <div>
              <label htmlFor="dual_citizenship">Dual Citizenship</label>
              <input type="checkbox" id="dual_citizenship" />
            </div>
            <div>
              <div>
                <input type="checkbox" id="by_birth" />
                <label htmlFor="by_birth">by birth</label>
              </div>
              <div>
                <input type="checkbox" id="by_naturalization" />
                <label htmlFor="by_naturalization">by naturalization</label>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="country">Pls. indicate country:</label>
            <select id="country">
              <option value="usa">USA</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
