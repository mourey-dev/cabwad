import { useParams, useNavigate } from "react-router-dom";
import FormOne from "./Files/FormOne";
import FormTwo from "./Files/FormTwo";
import FormThree from "./Files/FormThree";
import FormFour from "./Files/FormFour";

type RouteParams = Record<string, string | undefined>;

const FormContainer: React.FC = () => {
  const { page } = useParams<RouteParams>();
  const navigate = useNavigate();
  const currentPage: number = Number(page) || 1;

  const forms: Record<number, JSX.Element> = {
    1: <FormOne />,
    2: <FormTwo />,
    3: <FormThree />,
    4: <FormFour />,
  };

  // Redirect if page is invalid
  if (!forms[currentPage]) {
    navigate("/form/1", { replace: true });
    return null;
  }

  return <div className="">{forms[currentPage]}</div>;
};

export default FormContainer;
