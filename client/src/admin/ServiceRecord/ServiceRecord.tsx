import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../../components";

// Dummy Employee Data
const employees = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
];

const ServiceRecord: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-blue-700 text-white">
      <Header />
      <main className="flex flex-1 flex-col items-center p-8">
        <h2 className="font-krona-one text-3xl">Service Record</h2>

        {/* Table */}
        <div className="mt-6 w-full max-w-4xl">
          <table className="h-[100px] w-full border-collapse border border-gray-200 bg-white text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-center">Employees</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="border p-3">{employee.name}</td>
                  <td className="flex justify-center gap-2 border p-3">
                    <button
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                      onClick={() =>
                        navigate("/admin/service_record/service_record_form")
                      }
                    >
                      Insert
                    </button>

                    <button
                      className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-400"
                      onClick={() => console.log("Update", employee.id)}
                    >
                      Update
                    </button>
                    <button
                      className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-400"
                      onClick={() => console.log("View", employee.id)}
                    >
                      View
                    </button>
                    <button
                      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-400"
                      onClick={() => console.log("Delete", employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceRecord;
