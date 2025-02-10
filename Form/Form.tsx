const Form = () => {
  return (
    <form className="w-[90%] mx-auto border-2 mt-8">
      <div className="border-b-2">
        <div className="flex flex-col">
          <span className="italic text-[.75rem] font-bold">
            CS Form No. 212
          </span>
          <span className="italic text-[.5rem] font-bold">Revised 2017</span>
        </div>
        <div>
          <h1 className="uppercase font-bold text-2xl text-center">
            Personal Data Sheet
          </h1>
        </div>
        <div>
          <p className="font-bold text-[.75rem]">
            WARNING: Any misrepresentation made in the Personal Data Sheet and
            the Work Experience Sheet shall cause the filing of
            administrative/criminal case/s against the person concerned.
          </p>
          <p className="font-bold text-[.7rem]">
            READ THE ATTACHED GUIDE TO FILLING OUT THE PERSONAL DATA SHEET (PDS)
            BEFORE ACCOMPLISHING THE PDS FORM.
          </p>
          <div className="flex">
            <p className="text-[.7rem] flex items-center">
              Print legibly. Tick appropriate boxes{" "}
              <div className="border-[1px] w-2 h-2 mx-1"></div> and use separate
              sheet if necessary. Indicate N/A if not applicable.{" "}
              <span className="font-bold">DO NOT ABBREVIATE.</span>
            </p>
            <div className="flex grow-1">
              <label
                htmlFor="csc"
                className="text-[.7rem] flex-none border-2 ml-2 pr-1"
              >
                1. CS ID no.
              </label>
              <input
                type="text"
                id="csc"
                placeholder="(Do not fill up. For CSC use only)"
                className="border-2 text-[.7rem] grow outline-0 border-x-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[.7rem] font-bold uppercase">
          I. Personal Information
        </h3>
        <div className="flex col">
          <label
            htmlFor="surname"
            className="uppercase text-[.7rem] w-24 border-t-2"
          >
            1. Surname
          </label>
          <input
            id="surname"
            type="text"
            className="border-2 text-[.7rem] grow border-r-0 border-b-0"
          />
        </div>
        <div className="flex col">
          <label
            htmlFor="first_name"
            className="uppercase text-[.7rem] w-24 pl-3"
          >
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            className="border-2 text-[.7rem] grow border-r-0 border-b-0"
          />
        </div>
        <div className="flex col">
          <label
            htmlFor="middle_name"
            className="uppercase text-[.7rem] w-24 pl-3"
          >
            Middle Name
          </label>
          <input
            type="text"
            id="middle_name"
            className="border-2 text-[.7rem] grow border-r-0"
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
