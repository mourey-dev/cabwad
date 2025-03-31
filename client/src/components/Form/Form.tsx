import FormOne from "./Files/FormOne";
import FormTwo from "./Files/FormTwo";
import FormThree from "./Files/FormThree";
import FormFour from "./Files/FormFour";
import Pagination from "./Pagination";
import ModalForm from "../../admin/Form/ModalForm";

import PDSForm from "../../types/form";

import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

type RouteParams = Record<string, string | undefined>;

const Form = () => {
  const { page, employeeId, mode } = useParams<RouteParams>();
  const navigate = useNavigate();
  const currentPage: number = Number(page) || 1;
  const { register, handleSubmit, setValue } = useForm<PDSForm>();

  useEffect(() => {
    if (employeeId) {
      setValue("employee_id", employeeId);
    }
  }, []);

  const nextPage = (page: number) => {
    navigate(
      employeeId
        ? `/admin/form/${page}/${employeeId}/${mode}`
        : `/admin/form/${page}`,
    );
  };

  const forms: Record<number, JSX.Element> = {
    1: <FormOne register={register} nextPage={nextPage} />,
    2: <FormTwo register={register} nextPage={nextPage} />,
    3: <FormThree register={register} nextPage={nextPage} />,
    4: (
      <FormFour
        register={register}
        setValue={setValue}
        handleSubmit={handleSubmit}
      />
    ),
  };

  // Redirect if page is invalid
  if (!forms[currentPage]) {
    navigate("/admin/form/1", { replace: true });
    return null;
  }

  return (
    <div className="">
      {forms[currentPage]}
      <Pagination />
      {!employeeId && <ModalForm register={register} setValue={setValue} />}
    </div>
  );
};

export default Form;
