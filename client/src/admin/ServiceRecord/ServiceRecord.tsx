import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../../components";
import Pagination from "../../components/Pagination"; // Adjust the import path as needed

// Dummy Employee Data
const employees = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
  { id: 4, name: "Bob Brown" },
  { id: 5, name: "Charlie White" },
  { id: 6, name: "Diana Green" },
  { id: 7, name: "Eve Black" },
  { id: 8, name: "Frank Blue" },
];

const PAGE_SIZE = 3; // Number of employees per page

const ServiceRecord: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(employees.length / PAGE_SIZE);

  // Get employees for the current page
  const currentEmployees = employees.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="flex min-h-screen flex-col bg-blue-700 text-white">
      <Header />
      <main className="flex flex-1 flex-col items-center p-8">
        <h2 className="font-krona-one text-3xl">Service Record</h2>

        {/* Table */}
        <div className="max-w-8xl mt-4 w-full">
          <table className="mb-4 h-[100px] w-full border-collapse border border-gray-200 bg-white text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="h-8 border p-3 text-center">Employees</th>
                <th className="h-8 border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="border p-3">{employee.name}</td>
                  <td className="flex h-14 justify-center gap-4 border p-3">
                    <button
                      className="rounded bg-blue-500 px-4 text-white hover:bg-blue-400"
                      onClick={() =>
                        navigate("/admin/service_record/service_record_form")
                      }
                    >
                      Insert
                    </button>

                    <button
                      className="rounded bg-yellow-500 px-4 text-white hover:bg-yellow-400"
                      onClick={() => console.log("Update", employee.id)}
                    >
                      Update
                    </button>
                    <button
                      className="rounded bg-green-500 px-4 text-white hover:bg-green-400"
                      onClick={() => console.log("View", employee.id)}
                    >
                      View
                    </button>
                    <button
                      className="rounded bg-red-500 px-4 text-white hover:bg-red-400"
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={currentPage < totalPages}
          hasPrevious={currentPage > 1}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ServiceRecord;
