import print from "../../assets/images/printer.png";

import FormOne from "./Files/FormOne";
import FormTwo from "./Files/FormTwo";
import FormThree from "./Files/FormThree";
import FormFour from "./Files/FormFour";
import Pagination from "./Pagination";
import ModalForm from "../../pages/Form/ModalForm";

import PDSForm from "../../types/form";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

type RouteParams = Record<string, string | undefined>;

const Form = () => {
  const [employmentType, setEmploymentType] = useState("");
  const [department, setDepartment] = useState("");
  const employmentTypes = ["Permanent", "Casual", "Job Order"];
  const [showModal, setShowModal] = useState(true);
  const { page } = useParams<RouteParams>();
  const navigate = useNavigate();
  const currentPage: number = Number(page) || 1;
  const { register } = useForm<PDSForm>();

  const forms: Record<number, JSX.Element> = {
    1: <FormOne register={register} />,
    2: <FormTwo />,
    3: <FormThree />,
    4: <FormFour register={register} />,
  };

  // Redirect if page is invalid
  if (!forms[currentPage]) {
    navigate("/form/1", { replace: true });
    return null;
  }

  return (
    <div className="">
      <div className="relative">
        <button type="button" className="absolute right-0 cursor-pointer">
          <img src={print} alt="print-button" className="mt-15 mr-15 h-7 w-7" />
        </button>
      </div>
      {forms[currentPage]}
      <Pagination />
      <ModalForm
        showModal={showModal}
        setShowModal={setShowModal}
        employmentType={employmentType}
        setEmploymentType={setEmploymentType}
        department={department}
        setDepartment={setDepartment}
        employmentTypes={employmentTypes}
      />
    </div>
  );
};

export default Form;
