import { useNavigate } from "react-router-dom";
import arrow from "../../assets/images/right-arrow.png";

// Component
import { Header } from "../../components";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col text-white">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center bg-[url(/src/assets/images/logo-bg.png)] bg-cover bg-center bg-no-repeat p-8 text-center">
        <h2 className="font-krona-one text-3xl">EMPLOYEE MANAGEMENT SYSTEM</h2>
        <p className="font-inter mt-15 grid grid-cols-1 gap-69 text-sm md:grid-cols-3">
          SUMMARY
        </p>
        <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 text-black shadow-lg">
            <h3 className="font-inter font-semibold">Permanents:</h3>
            <p className="text-2xl font-bold">##</p>
          </div>
          <div className="rounded-lg bg-white p-6 text-black shadow-lg">
            <h3 className="font-inter font-semibold">Casuals:</h3>
            <p className="text-2xl font-bold">##</p>
          </div>
          <div className="rounded-lg bg-white p-6 text-black shadow-lg">
            <h3 className="font-inter font-semibold">Job Orders:</h3>
            <p className="text-2xl font-bold">##</p>
          </div>
        </div>
        <div className="mt-2">
          <button
            onClick={() => navigate("/employees")}
            className="font-inter cursor-pointer text-sm underline hover:text-blue-500"
          >
            See List &gt; &gt;
          </button>
        </div>
        <div className="mt-6">
          <button
            className="flex cursor-pointer items-center rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white hover:bg-green-300"
            onClick={() => navigate("/form/1")}
          >
            PDS Form
            <span className="ml-2 text-xl">
              <img src={arrow} alt="right-arrow" className="w-5" />
            </span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="font-inter bg-yellow-500 p-4 text-center text-black">
        <p>
          COPYRIGHT © 2025 |{" "}
          <span className="font-inter font-semibold text-blue-700">
            CABUYAO WATER DISTRICT
          </span>{" "}
          ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
