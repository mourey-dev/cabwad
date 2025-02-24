import remove from "../../assets/images/remove-user.png";
import displayPic from "../../assets/images/displayPic.png";

// Hooks
import { useGet } from "../../hooks";

// Types
import { EmployeesData } from "../../types/employee";

// Components
import { Header, Footer } from "../../components";
import Loading from "../../components/Loading";
import { useState } from "react";

const Employees = () => {
  const [category, setCategory] = useState("PERMANENT");
  const { loading, data } = useGet<EmployeesData>(
    `/employee/list/?category=${category}`,
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {loading && <Loading loading={loading} />}
      <Header />

      <main className="flex-1">
        {/* Title */}
        <div className="px-6 py-4">
          <h2 className="text-xl font-bold text-blue-600">
            CABWAD List of Employees: <span className="text-gray-600">##</span>
          </h2>
        </div>

        {/* Navigation Tabs */}
        <div className="absolute top-20 right-2">
          <button
            onClick={() => setCategory("PERMANENT")}
            className="rounded px-4 py-1 text-blue-600 transition duration-300 hover:border-2 hover:border-blue-600 hover:bg-blue-100"
          >
            Permanents
          </button>
          <button
            onClick={() => setCategory("CASUAL")}
            className="rounded px-4 py-1 text-blue-600 transition duration-300 hover:border-2 hover:border-blue-600 hover:bg-blue-100"
          >
            Casuals
          </button>
          <button
            onClick={() => setCategory("JOB OFFER")}
            className="rounded px-4 py-1 text-blue-600 transition duration-300 hover:border-2 hover:border-blue-600 hover:bg-blue-100"
          >
            Job Offers
          </button>
          <button className="rounded px-4 py-1 text-blue-600 transition duration-300 hover:border-2 hover:border-blue-600 hover:bg-blue-100">
            Resigned
          </button>
        </div>

        {/* Employee Grid */}
        <div className="mb-23 grid grid-cols-5 gap-6 px-6 py-6">
          {data?.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-col items-center rounded-md bg-white p-4 shadow-md transition-all delay-150 duration-300 hover:bg-blue-600"
            >
              <button className="absolute top-2 right-2">
                <img src={remove} alt="Remove User" className="w-6" />
              </button>

              {/* Employee Image and Info */}
              <img src={displayPic} alt="Employee Icon" className="mt-4 w-16" />
              <p className="mt-2 font-bold text-gray-800">{`${item.first_name} ${item.surname}`}</p>
              <p className="text-sm text-gray-500">{`${item.position}`}</p>
              <p className="text-center text-xs text-gray-400">{`${item.department}`}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Employees;
