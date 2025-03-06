import { useState } from "react";
import { EmployeeData } from "../../../types/employee";

interface EmployeeUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeData;
}

export default function EmployeeUpdateModal({
  isOpen,
  onClose,
  employee,
}: EmployeeUpdateModalProps) {
  const [formData, setFormData] = useState({
    employee_id: "",
    surname: "",
    first_name: "",
    middle_name: "",
    sex: "",
    civil_status: "",
    phone: "",
    email: "",
    employment_status: "",
    eligibility: "",
    position: "",
    birth_date: "",
    first_day_service: "",
  });

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null; // Don't render when closed

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Update Employee Information</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Employee Details */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-2 font-bold">Employee Details</h3>
            <input
              name="idNo"
              value={formData.employee_id}
              onChange={handleChange}
              placeholder="ID No."
              className="input-field mb-2 rounded border"
            />
            <input
              name="lastName"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Last Name"
              className="input-field mb-2 rounded border"
            />
            <input
              name="firstName"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="input-field mb-2 rounded border"
            />
            <input
              name="middleName"
              value={formData.middle_name}
              onChange={handleChange}
              placeholder="Middle Name"
              className="input-field mb-2 rounded border"
            />
            <input
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              placeholder="Sex"
              className="input-field mb-2 rounded border"
            />
            <input
              name="civilStatus"
              value={formData.civil_status}
              onChange={handleChange}
              placeholder="Civil Status"
              className="input-field mb-2 rounded border"
            />
          </div>

          {/* Employment Details */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="mb-2 font-bold">Employment Details</h3>
            <input
              name="appointmentStatus"
              value={formData.employment_status}
              onChange={handleChange}
              placeholder="Appointment Status"
              className="input-field mb-2 rounded border"
            />
            <input
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              placeholder="Civil Service Eligibility"
              className="input-field mb-2 rounded border"
            />
            <input
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Position"
              className="input-field mb-2 rounded border"
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
              className="input-field mb-2 rounded border"
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
              className="input-field mb-2 rounded border"
            />
          </div>

          {/* Contact Information */}
          <div className="col-span-2">
            <h3 className="mb-2 font-bold">Contact</h3>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone No."
              className="input-field mr-2 rounded border"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="input-field mb-2 rounded border"
            />
          </div>

          {/* Buttons */}
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
