import PDSForm from "../../types/form";
import { UseFormRegister } from "react-hook-form";

import { useState } from "react";

type ModalFormProps = {
  register: UseFormRegister<PDSForm>;
};

const ModalForm = ({ register }: ModalFormProps) => {
  const [showModal, setShowModal] = useState(true);

  return (
    showModal && (
      <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-gray-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowModal(false);
          }}
          className="w-96 rounded-lg bg-white p-6 shadow-lg"
        >
          <h2 className="mb-4 text-xl font-bold">
            Employment Type and Department
          </h2>
          <div className="mb-4">
            <label htmlFor="employee_type" className="block font-semibold">
              Employment Type:
            </label>
            <select
              id="employee_type"
              defaultValue=""
              {...register("position")}
              required
              className="mt-1 w-full border p-2"
            >
              <option value="" disabled>
                Select an employment type
              </option>
              <option value="PERMANENT">Permanent</option>
              <option value="CASUAL">Casual</option>
              <option value="JOB ORDER">Job Order</option>
              <option value="CO-TERMINUS">Co-Terminus</option>
              <option value="CONTACT 0F SERVICE">Contact of Service</option>
              <option value="TEMPORARY">Temporary</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="department" className="block font-semibold">
              Department:
            </label>
            <select
              id="department"
              defaultValue=""
              {...register("department")}
              required
              className="mt-1 w-full border p-2"
            >
              <option value="" disabled>
                Select a department
              </option>
              <option>
                Engineering, Construction, Maintenance and Production Division
              </option>
              <option>Administrative and General Services Division</option>
              <option>Finance and Commercial Division</option>
              <option>Office of the General Manager</option>
            </select>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white"
            >
              Proceed
            </button>
          </div>
        </form>
      </div>
    )
  );
};

export default ModalForm;
