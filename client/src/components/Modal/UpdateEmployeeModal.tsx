import { useForm } from "react-hook-form";
import { EmployeeData } from "../../types/employee";
import { toUpperCase } from "../../utils/formatters";
import { useUpdateEmployee } from "../../hooks/useEmployee";
import { positions } from "../../data/positions";
import { useState } from "react";

// Context
import { useStatus } from "../../context/StatusContext";
import Loading from "../Loading";

type EmployeeUpdateModalProps = {
  show: boolean;
  onClose: () => void;
  employee: EmployeeData;
};

type EmployeeUpdateForm = {
  employee_id: string;
  surname: string;
  first_name: string;
  middle_name: string;
  sex: string;
  civil_status: string;
  phone: string;
  email: string;
  employment_status: string;
  eligibility: string;
  position: string;
  birth_date: string;
  first_day_service: string;
  address: string;
};

export default function EmployeeUpdateModal({
  show,
  onClose,
  employee,
}: EmployeeUpdateModalProps) {
  const { status, setStatus } = useStatus();
  const { mutate: updateEmployee, isPending } = useUpdateEmployee();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmployeeUpdateForm>({
    defaultValues: {
      // Transform initial values to uppercase
      employee_id: employee.employee_id.toUpperCase(),
      surname: employee.surname.toUpperCase(),
      first_name: employee.first_name.toUpperCase(),
      middle_name: employee.middle_name?.toUpperCase(),
      sex: employee.sex.toUpperCase(),
      civil_status: employee.civil_status.toUpperCase(),
      phone: employee.phone,
      email: employee.email,
      employment_status: employee.appointment_status.toUpperCase(),
      eligibility: employee.civil_service?.toUpperCase(),
      position: employee.position.toUpperCase(),
      birth_date: employee.birth_date,
      first_day_service: employee.first_day_service,
      address: employee.address.toUpperCase(),
    },
  });
  const [filteredPositions, setFilteredPositions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

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

  const onSubmit = (data: EmployeeUpdateForm) => {
    updateEmployee(
      {
        employeeData: {
          employee_id: data.employee_id,
          surname: data.surname,
          first_name: data.first_name,
          middle_name: data.middle_name || "",
          sex: data.sex,
          civil_status: data.civil_status,
          phone: data.phone,
          email: data.email,
          appointment_status: data.employment_status,
          civil_service: data.eligibility || "",
          position: data.position,
          birth_date: data.birth_date,
          first_day_service: data.first_day_service,
          address: data.address,
        },
        employeeId: employee.employee_id,
      },
      {
        onSuccess: (response) => {
          setStatus({ ...status, success: true, message: response.detail });
          onClose();
        },
        onError: (error) => {
          setStatus({
            ...status,
            error: true,
            message: `Failed to update employee`,
          });
          console.log(error);
        },
      },
    );
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
      <Loading loading={isPending} />
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-bold text-blue-900">
          Update Employee Information
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
          autoComplete="off"
        >
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-2 font-bold">Employee Details</h3>

            <div>
              <label
                htmlFor="employee_id"
                className="block text-sm font-medium text-gray-700"
              >
                ID Number *
              </label>
              <input
                id="employee_id"
                {...register("employee_id", {
                  required: "ID is required",
                  onChange: (e) =>
                    setValue("employee_id", toUpperCase(e.target.value)),
                })}
                className="input-field mt-1 w-full rounded border px-2 py-1"
                autoComplete="off"
              />
              {errors.employee_id && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.employee_id.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="surname"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name *
              </label>
              <input
                id="surname"
                {...register("surname", {
                  required: "Last name is required",
                  onChange: (e) =>
                    setValue("surname", toUpperCase(e.target.value)),
                })}
                className="input-field mt-1 w-full rounded border px-2 py-1"
                autoComplete="off"
              />
              {errors.surname && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.surname.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name *
              </label>
              <input
                id="first_name"
                {...register("first_name", {
                  required: "First name is required",
                  onChange: (e) =>
                    setValue("first_name", toUpperCase(e.target.value)),
                })}
                className="input-field mt-1 w-full rounded border px-2 py-1"
                autoComplete="off"
              />
              {errors.first_name && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="middle_name"
                className="block text-sm font-medium text-gray-700"
              >
                Middle Name
              </label>
              <input
                id="middle_name"
                {...register("middle_name", {
                  onChange: (e) =>
                    setValue("middle_name", toUpperCase(e.target.value)),
                })}
                className="input-field mt-1 w-full rounded border px-2 py-1"
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="sex"
                className="block text-sm font-medium text-gray-700"
              >
                Sex *
              </label>
              <select
                id="sex"
                {...register("sex", { required: "Sex is required" })}
                className="input-field mt-1 w-full rounded border px-2 py-1"
                autoComplete="off"
              >
                <option value="">SELECT SEX</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
              {errors.sex && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.sex.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="civil_status"
                className="block text-sm font-medium text-gray-700"
              >
                Civil Status *
              </label>
              <input
                id="civil_status"
                {...register("civil_status", {
                  required: "Civil status is required",
                  onChange: (e) =>
                    setValue("civil_status", toUpperCase(e.target.value)),
                })}
                className="input-field mt-1 w-full rounded border px-2 py-1"
                autoComplete="off"
              />
              {errors.civil_status && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.civil_status.message}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2 pt-8 md:col-span-1">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address *
              </label>
              <input
                id="address"
                {...register("address", {
                  required: "Status is required",
                  onChange: (e) =>
                    setValue("address", toUpperCase(e.target.value)),
                })}
                className="input-field mt-1 w-full rounded border px-2 py-1"
                autoComplete="off"
              />
              {errors.address && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="employment_status"
                className="block text-sm font-medium text-gray-700"
              >
                Appointment Status *
              </label>
              <select
                id="employment_status"
                {...register("employment_status", {
                  required: "Status is required",
                })}
                className="input-field mt-1 w-full rounded border px-2 py-1"
                autoComplete="off"
              >
                <option value="" disabled>
                  Select an employment status
                </option>
                <option value="PERMANENT">PERMANENT</option>
                <option value="CASUAL">CASUAL</option>
                <option value="JOB ORDER">JOB ORDER</option>
                <option value="CO-TERMINUS">CO-TERMINUS</option>
                <option value="CONTACT OF SERVICE">CONTACT OF SERVICE</option>
                <option value="TEMPORARY">TEMPORARY</option>
              </select>
              {errors.employment_status && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.employment_status.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="eligibility"
                className="block text-sm font-medium text-gray-700"
              >
                Civil Service Eligibility
              </label>
              <input
                id="eligibility"
                {...register("eligibility", {
                  onChange: (e) =>
                    setValue("eligibility", toUpperCase(e.target.value)),
                })}
                className="input-field mt-1 w-full rounded border px-2 py-1"
                autoComplete="off"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position *
              </label>
              <input
                id="position"
                {...register("position", {
                  required: "Position is required",
                  onChange: handleChange,
                })}
                className="input-field mt-1 w-full rounded border px-2 py-1 uppercase"
                autoComplete="off"
              />
              {errors.position && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.position.message}
                </p>
              )}

              {/* Display dropdown for position selection */}
              {showDropdown && filteredPositions.length > 0 && (
                <div className="ring-opacity-5 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 ring-1 shadow-lg ring-black">
                  {filteredPositions.map((position, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setValue("position", position.toUpperCase());
                        setShowDropdown(false);
                        setFilteredPositions([]);
                      }}
                      className="cursor-pointer px-4 py-2 uppercase hover:bg-gray-100"
                    >
                      {position}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="birth_date"
                className="block text-sm font-medium text-gray-700"
              >
                Birth Date *
              </label>
              <input
                id="birth_date"
                type="date"
                {...register("birth_date", {
                  required: "Birth date is required",
                })}
                className="input-field mt-1 w-full rounded border px-2 py-1"
                autoComplete="off"
              />
              {errors.birth_date && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.birth_date.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="first_day_service"
                className="block text-sm font-medium text-gray-700"
              >
                First Day of Service *
              </label>
              <input
                id="first_day_service"
                type="date"
                {...register("first_day_service", {
                  required: "First day of service is required",
                })}
                className="input-field mt-1 w-full rounded border px-2 py-1"
                autoComplete="off"
              />
              {errors.first_day_service && (
                <p className="text-sm text-red-500" role="alert">
                  {errors.first_day_service.message}
                </p>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <h3 className="mb-2 font-bold">Contact</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone No. *
                </label>
                <input
                  id="phone"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="input-field mt-1 rounded border px-2 py-1"
                  autoComplete="off"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email *
                </label>
                <input
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="input-field mt-1 rounded border px-2 py-1"
                  autoComplete="off"
                />
                {errors.email && (
                  <p className="text-sm text-red-500" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-2 flex justify-end space-x-4">
            <button
              type="button"
              className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
