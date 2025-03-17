import { useState } from "react";
import { EmployeeData } from "../../../types/employee";

type EmployeeUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeData;
}

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
  image: string;
}

export default function EmployeeUpdateModal({
  isOpen,
  onClose,
  employee,
}: EmployeeUpdateModalProps) {
  const [formData, setFormData] = useState({
    employee_id: employee.employee_id,
    surname: employee.surname,
    first_name: employee.first_name,
    middle_name: employee.middle_name,
    sex: employee.sex,
    civil_status: employee.civil_status,
    phone: employee.phone,
    email: employee.email,
    employment_status: employee.appointment_status,
    eligibility: employee.civil_service,
    position: employee.position,
    birth_date: employee.birth_date,
    first_day_service: employee.first_day_service,
    image: employee.image || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-bold text-blue-900">
          Update Employee Information
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col items-center">
            <h3 className="mb-2 font-bold">Profile Image</h3>
            <label className="flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-2 font-bold">Employee Details</h3>
            <input
              name="idNo"
              value={formData.employee_id}
              onChange={handleChange}
              placeholder="ID No."
              className="input-field mb-2 rounded border px-2 py-1"
            />
            <input
              name="lastName"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Last Name"
              className="input-field mb-2 rounded border px-2 py-1"
            />
            <input
              name="firstName"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="input-field mb-2 rounded border px-2 py-1"
            />
            <input
              name="middleName"
              value={formData.middle_name}
              onChange={handleChange}
              placeholder="Middle Name"
              className="input-field mb-2 rounded border px-2 py-1"
            />
            <input
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              placeholder="Sex"
              className="input-field mb-2 rounded border px-2 py-1"
            />
            <input
              name="civilStatus"
              value={formData.civil_status}
              onChange={handleChange}
              placeholder="Civil Status"
              className="input-field mb-2 rounded border px-2 py-1"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-2 font-bold">Employment Details</h3>
            <input
              name="appointmentStatus"
              value={formData.employment_status}
              onChange={handleChange}
              placeholder="Appointment Status"
              className="input-field mb-2 rounded border px-2 py-1"
            />
            <input
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              placeholder="Civil Service Eligibility"
              className="input-field mb-2 rounded border px-2 py-1"
            />
            <input
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Position"
              className="input-field mb-2 rounded border px-2 py-1"
            />
            <br />
            <label htmlFor="birthDate" className="input-label text-gray-500">
              Birth Date:
            </label>
            <br />
            <input
              type="date"
              name="birthDate"
              value={formData.birth_date}
              onChange={handleChange}
              className="input-field mb-2 rounded border px-2 py-1"
            />
            <br />
            <label
              htmlFor="firstDayService"
              className="input-label mb-2 text-gray-500"
            >
              First Day of Service:
            </label>
            <br />
            <input
              type="date"
              name="firstDayService"
              value={formData.first_day_service}
              onChange={handleChange}
              className="input-field mb-2 rounded border px-2 py-1"
            />
          </div>
          <div className="col-span-2">
            <h3 className="mb-2 font-bold">Contact</h3>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone No."
              className="input-field mr-2 rounded border px-2 py-1"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="input-field mb-2 rounded border px-2 py-1"
            />
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
