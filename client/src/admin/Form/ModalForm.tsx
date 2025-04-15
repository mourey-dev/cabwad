import PDSForm from "../../types/form";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { positions } from "../../data/positions";
import { useState } from "react";

type ModalFormProps = {
  register: UseFormRegister<PDSForm>;
  setValue: UseFormSetValue<PDSForm>;
};

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
              autoFocus
              required
              autoComplete="off"
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
              autoComplete="off"
            >
              <option value="" disabled>
                Select an employment status
              </option>
              <option value="PERMANENT">Permanent</option>
              <option value="CASUAL">Casual</option>
              <option value="JOB ORDER">Job Order</option>
            </select>
          </div>

          <div className="relative mb-4 w-full">
            <input
              type="text"
              value={searchTerm}
              {...register("position", {
                onChange: handleChange,
              })}
              placeholder="Enter Employee Position"
              className="w-full rounded border p-2"
              autoComplete="off"
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
              autoComplete="off"
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
            <label htmlFor="first_day_service" className="block font-semibold">
              First Day of Service:
            </label>
            <input
              id="first_day_service"
              title="first_day_service"
              {...register("first_day_service")}
              type="date"
              className="mt-1 w-full rounded border p-2"
              required
              autoComplete="off"
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
