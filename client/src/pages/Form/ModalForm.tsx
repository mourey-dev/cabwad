import PDSForm from "../../types/form";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { useState } from "react";

type ModalFormProps = {
  register: UseFormRegister<PDSForm>;
  setValue: UseFormSetValue<PDSForm>;
};

const positions = [
  "Accounting Processor B",
  "Administrative Services Aide",
  "Administrative Services Officer A",
  "Administration Services Assistant A",
  "Administration Services Assistant C",
  "Cashier D",
  "Collection Assistant",
  "Customer Service Assistant A",
  "Customer Service Assistant B",
  "Customer Service Assistant C",
  "Customer Service Assistant D",
  "Customer Service Officer B",
  "Division Manager C",
  "Driver",
  "Engineering Aide A",
  "Engineering Aide B",
  "Engineering Assistant A",
  "General Manager",
  "Senior Accounting Processor B",
  "Senior Corporate Accountant C",
  "Senior Engineer A",
  "Storekeeper B",
  "Supply Assistant B",
  "Utility Worker A",
  "Utility Worker B",
  "Utilities Service Assistant E",
  "Water Maintenance Foreman",
  "Water Maintenance Man A",
  "Water Maintenance Man B",
  "Water Maintenance Man C",
  "Water Resources Facilities Operator A",
  "Water Resources Facilities Operator B",
  "Water Resources Facilities Operator C",
  "Water Resources Facilities Operator Foreman",
  "Water Resources Facilities Tender A",
  "Water Resources Facilities Tender B",
  "Water Utilities Development Officer A",
];

const ModalForm = ({ register, setValue }: ModalFormProps) => {
  const [showModal, setShowModal] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPositions, setFilteredPositions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredPositions([]);
      setShowDropdown(false);
    } else {
      const filtered = positions.filter((position) =>
        position.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredPositions(filtered);
      setShowDropdown(true);
    }
  };

  const handleSelect = (position: string) => {
    setSearchTerm(position);
    setValue("position", position);
    setShowDropdown(false);
  };

  return (
    showModal && (
      <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-gray-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowModal(false);
          }}
          className="w-96 rounded-lg bg-white p-6 shadow-lg"
          autoComplete="off"
        >
          <h2 className="mb-4 text-center text-xl font-bold">
            Employee Information
          </h2>
          <div className="mb-4">
            <label htmlFor="employee_type" className="block font-semibold">
              ID No.:
            </label>
            <input
              title="employee_id"
              {...register("employee_id")}
              type="number"
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="employee_type" className="block font-semibold">
              Employment Status:
            </label>
            <select
              id="employee_type"
              defaultValue=""
              {...register("employment_status")}
              required
              className="mt-1 w-full rounded border p-2"
            >
              <option value="" disabled>
                Select an employment status
              </option>
              <option value="PERMANENT">Permanent</option>
              <option value="CASUAL">Casual</option>
              <option value="JOB ORDER">Job Order</option>
              <option value="CO-TERMINUS">Co-Terminus</option>
              <option value="CONTACT 0F SERVICE">Contact of Service</option>
              <option value="TEMPORARY">Temporary</option>
            </select>
          </div>

          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              {...register("position", {
                onChange: handleChange,
              })}
              placeholder="Enter Employee Position"
              className="w-full rounded border p-2"
              required
            />
            {showDropdown && filteredPositions.length > 0 && (
              <ul className="absolute mt-1 max-h-40 w-full overflow-y-auto rounded border bg-white shadow-lg">
                {filteredPositions.map((position, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(position)}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                  >
                    {position}
                  </li>
                ))}
              </ul>
            )}
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
              className="mt-1 w-full rounded border p-2"
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

          <div className="mb-4">
            <label htmlFor="department" className="block font-semibold">
              First Day of Service:
            </label>
            <input
              title="first_day_service"
              {...register("first_day_service")}
              type="date"
              className="mt-1 w-full rounded border p-2"
              required
            />
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
