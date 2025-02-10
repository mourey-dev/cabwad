import profile from "../../assets/images/account-black.png";
import arrow from "../../assets/images/right-arrow.png";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-600 text-white flex flex-col">
      {/* Header */}
      <header className="bg-white text-black flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Cabuyao Water District"
            className="h-8 mr-2"
          />
          <h1 className="font-bold">Cabuyao Water District</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <a href="#" className="text-blue-700 font-semibold mr-10">
            HOME
          </a>
          <img src={profile} alt="profile-logo" className="w-6 h-6" />
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-3xl font-bold">EMPLOYEE MANAGEMENT SYSTEM</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold">Permanents:</h3>
            <p className="text-2xl font-bold">##</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold">Casuals:</h3>
            <p className="text-2xl font-bold">##</p>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h3 className="font-semibold">Job Orders:</h3>
            <p className="text-2xl font-bold">##</p>
          </div>
        </div>
        <div className="mt-2">
          <button
            onClick={() => navigate("/employees")}
            className="text-sm underline hover:text-blue-500 cursor-pointer"
          >
            See List &gt; &gt;
          </button>
        </div>
        <div className="mt-6">
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-bold flex items-center hover:bg-green-200 cursor-pointer"
            onClick={() => navigate("/form")}
          >
            PDS Form
            <span className="ml-2 text-xl">
              <img src={arrow} alt="right-arrow" className="w-5" />
            </span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-yellow-500 text-black text-center p-4">
        <p>
          COPYRIGHT © 2025 |{" "}
          <span className="text-blue-700 font-semibold">
            CABUYAO WATER DISTRICT
          </span>{" "}
          ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
