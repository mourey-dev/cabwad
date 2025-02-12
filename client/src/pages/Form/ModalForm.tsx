interface ModalFormProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  employmentType: string;
  setEmploymentType: (type: string) => void;
  department: string;
  setDepartment: (dept: string) => void;
  employmentTypes: string[];
}

const ModalForm: React.FC<ModalFormProps> = ({
  showModal,
  setShowModal,
  employmentType,
  setEmploymentType,
  department,
  setDepartment,
  employmentTypes,
}) => {
  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">
            Employment Type and Department
          </h2>
          <div className="mb-4">
            <label className="block font-semibold">Employment Type:</label>
            <select
              className="w-full border p-2 mt-1"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">Select an employment type</option>
              {employmentTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Department:</label>
            <select
              className="w-full border p-2 mt-1"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select a department</option>
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
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setShowModal(false)}
              disabled={!employmentType || !department}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ModalForm;
