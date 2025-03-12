import { Form as FormComponent, Header, Footer } from "../../components";

const Form = () => {
  return (
    <div className="flex min-h-screen flex-col bg-blue-600 text-black">
      <Header />
      <FormComponent />
      <Footer />
    </div>
  );
};

export default Form;
