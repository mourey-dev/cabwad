import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom"; // Add useNavigate
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Add useMutation and useQueryClient
import {
  fetchEmployeeServiceRecord,
  addOrUpdateEmployeeServiceRecord,
  downloadEmployeeServiceRecordPDF,
  openEmployeeServiceRecordPDF, // Import the function for downloading PDF
} from "../../../api/employeeRecord";
import { ServiceRecordFormType } from "../../../types/service_record";
import { Header, Footer, Loading } from "../../../components";
import BackButton from "../../../components/BackButton";
import logo from "../../../assets/images/logo-white.png";
import { toast } from "react-toastify"; // Import toast for notifications (install if needed)

const ServiceRecordForm = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate(); // For navigation after save
  const queryClient = useQueryClient(); // For invalidating queries after update
  const submitRef = useRef<HTMLInputElement>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceRecordFormType>();

  // Query for fetching employee data
  const { data: employeeServiceRecord, isLoading } = useQuery({
    queryFn: () => fetchEmployeeServiceRecord(employeeId || "1"),
    queryKey: ["employeeServiceRecord", employeeId],
    enabled: !!employeeId, // Only run query if employeeId exists
  });

  // Mutation for saving employee data
  const mutation = useMutation({
    mutationFn: (data: ServiceRecordFormType) =>
      addOrUpdateEmployeeServiceRecord(employeeId || "", data),
    onSuccess: () => {
      // Invalidate and refetch queries related to this employee
      queryClient.invalidateQueries({
        queryKey: ["employeeServiceRecord", employeeId],
      });
      toast.success("Service record saved successfully!");
      setIsSaving(false);
      setIsEditable(false); // Disable editing after successful save
    },
    onError: (error) => {
      console.error("Error saving service record:", error);
      toast.error("Failed to save service record. Please try again.");
      setIsSaving(false);
    },
  });

  // Submit handler
  const onSubmit = (data: ServiceRecordFormType) => {
    // Add the employee_id to the form data
    const formData = {
      ...data,
      employee_id: employeeId,
    };

    setIsSaving(true);
    mutation.mutate(formData);
  };

  // Populate form with existing data when it's loaded
  useEffect(() => {
    if (employeeServiceRecord) {
      // Set all form fields with data from the API
      Object.entries(employeeServiceRecord).forEach(([key, value]) => {
        if (key !== "service_records") {
          setValue(key as keyof ServiceRecordFormType, value);
        }
      });

      // Set service records array if it exists
      if (employeeServiceRecord.service_records?.length) {
        employeeServiceRecord.service_records.forEach((record, index) => {
          Object.entries(record).forEach(([field, value]) => {
            setValue(
              `service_records.${index}.${field}` as keyof ServiceRecordFormType,
              value,
            );
          });
        });
      }
    }
  }, [employeeServiceRecord, setValue]);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleToggleChange = () => {
    setIsEditable((prev) => !prev);
  };

  const handlePrintPDF = async () => {
    if (!employeeId) return;

    try {
      // Show loading state
      setIsSaving(true);

      // Download the PDF
      await openEmployeeServiceRecordPDF(employeeId);

      // Hide loading state
      setIsSaving(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Loading loading={isLoading || isSaving} />
      <Header />
      <div className="min-h-screen bg-blue-700 p-8 text-black">
        {/* Back Button */}
        <div className="mx-auto mb-4 flex w-[1100px] items-center justify-between">
          <BackButton onClick={handleBackClick} />

          {/* Toggle Switch */}
          <div className="mr-4 inline-block">
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                onChange={handleToggleChange}
                checked={isEditable}
              />
              <div
                className={`peer relative h-6 w-11 rounded-full bg-gray-500 peer-checked:bg-yellow-400 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white`}
              ></div>
              <span className="text-yellow ms-3 text-sm font-medium">
                UPDATE
              </span>
            </label>
          </div>
        </div>

        <div className="mx-auto w-full overflow-x-auto">
          <div className="mx-auto mb-4 flex w-[1100px] items-center gap-4 rounded border-l-4 border-blue-500 bg-blue-100 p-4 text-blue-700">
            <p className="font-semibold">Note:</p>
            <p>
              Employee personal information (name and birth details) cannot be
              edited through this form.
            </p>
          </div>

          <form
            className="mx-auto w-[1100px] border-4 bg-white"
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Header Section */}
            <div className="bg-white px-10 py-10">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="">
                  <img src={logo} alt="Company Logo" className="h-30 w-30" />
                </div>

                {/* Header Text */}
                <div className="flex-grow text-center">
                  <h1 className="text-xl font-bold">CABUYAO WATER DISTRICT</h1>
                  <p
                    className="mt-2 text-sm"
                    style={{ fontFamily: "'Times New Roman'" }}
                  >
                    B1 L40 Katapatan Homes, Banay-Banay, Cabuyao, Laguna
                  </p>
                  <p
                    className="mt-2 text-sm"
                    style={{ fontFamily: "'Times New Roman'" }}
                  >
                    Tel: (049) 832-1620 / 304-0049
                  </p>
                  <p
                    className="mt-2 text-sm"
                    style={{ fontFamily: "'Times New Roman'" }}
                  >
                    E-mail add: cabuyaowaterdistrict@gmail.com
                  </p>
                  <h2 className="font-jost mt-4 text-2xl font-extrabold tracking-wide">
                    SERVICE RECORD
                  </h2>
                </div>

                {/* Employee ID */}
                <div className="">
                  <label htmlFor="employee-id" className="text-xs">
                    {employeeId}
                  </label>
                </div>
              </div>
            </div>

            {/* Name Input Fields */}
            <div className="mt-4 mr-5 mb-4 ml-5 border-b border-black pb-2">
              <label className="block text-left font-semibold">Name:</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  className="border border-gray-300 bg-gray-100 p-2 font-semibold uppercase"
                  style={{ width: "400px" }}
                  placeholder="Surname"
                  disabled={true}
                  {...register("surname", { required: true })}
                  readOnly={true}
                />
                <input
                  type="text"
                  className="border border-gray-300 bg-gray-100 p-2 font-semibold uppercase"
                  style={{ width: "400px" }}
                  placeholder="Given Name"
                  disabled={true}
                  {...register("first_name", { required: true })}
                  readOnly={true}
                />
                <input
                  type="text"
                  className="border border-gray-300 bg-gray-100 p-2 font-semibold uppercase"
                  style={{ width: "400px" }}
                  placeholder="Middle Name"
                  disabled={true}
                  {...register("middle_name")}
                  readOnly={true}
                />
                <p className="mt-1 text-xs text-black">
                  (If married woman, provide full maiden name)
                </p>
              </div>
            </div>

            {/* Birth Input Fields */}
            <div className="mr-5 mb-4 ml-5 border-b border-black pb-2">
              <label className="block text-left font-semibold">Birth:</label>
              <div className="mt-1 flex gap-2">
                <input
                  title="Date of Birth"
                  type="text"
                  className="w-[630px] border border-gray-300 bg-gray-100 p-2 font-semibold uppercase"
                  placeholder="Date of Birth"
                  disabled={true}
                  {...register("birth_date", { required: true })}
                />
                <input
                  title="Place of Birth"
                  type="text"
                  className="w-[630px] border border-gray-300 bg-gray-100 p-2 font-semibold uppercase"
                  placeholder="Place of Birth"
                  disabled={true}
                  {...register("birth_place", { required: true })}
                />
                <p className="mt-1 text-xs text-black">
                  (Date herein should be checked from birth or baptismal
                  certificate or some other reliable documents)
                </p>
              </div>
            </div>

            {/* Table Section */}
            <table className="mt-4 w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-300 text-center text-xs font-bold">
                  <th className="border border-black px-2 py-1" colSpan={2}>
                    SERVICE <br />
                    (Inclusive Dates)
                  </th>
                  <th className="border border-black px-2 py-1" colSpan={3}>
                    RECORD OF APPOINTMENT
                  </th>
                  <th className="border border-black px-2 py-1">
                    OFFICE ENTITY/DIVISION
                  </th>
                  <th className="border border-black px-2 py-1">
                    Leave of Absence w/o Pay
                  </th>
                </tr>
                <tr className="bg-gray-200 text-center text-xs font-bold">
                  <th className="border border-black px-2 py-1">From</th>
                  <th className="border border-black px-2 py-1">To</th>
                  <th className="border border-black px-2 py-1">Designation</th>
                  <th className="border border-black px-2 py-1">Status</th>
                  <th className="border border-black px-2 py-1">Salary</th>
                  <th className="border border-black px-2 py-1">
                    Station/Place of Assignment
                  </th>
                  <th className="border border-black px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {[...Array(21)].map((_, index) => (
                  <tr key={index} className="text-center text-xs">
                    <td className="border border-black px-2 py-3">
                      <input
                        title="From Date"
                        type="text"
                        className="w-[105px] bg-transparent text-center outline-none"
                        placeholder="MM/DD/YYYY"
                        disabled={!isEditable}
                        {...register(`service_records.${index}.service_from`)}
                      />
                    </td>
                    <td className="border border-black px-2 py-3">
                      <input
                        type="text"
                        className="w-[105px] bg-transparent text-center outline-none"
                        placeholder="MM/DD/YYYY"
                        disabled={!isEditable}
                        {...register(`service_records.${index}.service_to`)}
                      />
                    </td>
                    <td className="border border-black px-10 py-3">
                      <input
                        type="text"
                        className="w-[190px] bg-transparent text-center uppercase outline-none"
                        placeholder="Designation"
                        disabled={!isEditable}
                        {...register(`service_records.${index}.designation`)}
                      />
                    </td>
                    <td className="border border-black py-3">
                      <input
                        type="text"
                        className="w-[100px] bg-transparent text-center uppercase outline-none"
                        placeholder="Status"
                        disabled={!isEditable}
                        {...register(`service_records.${index}.status`)}
                      />
                    </td>
                    <td className="border border-black py-3">
                      <input
                        type="text"
                        className="w-[100px] bg-transparent text-center outline-none"
                        placeholder="Salary"
                        {...register(`service_records.${index}.salary`)}
                        disabled={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-2 py-3">
                      <input
                        type="text"
                        className="w-[200px] bg-transparent text-center uppercase outline-none"
                        placeholder="Station/Place of Assignment"
                        {...register(`service_records.${index}.station`)}
                        disabled={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-2 py-3">
                      <input
                        type="text"
                        className="w-[125px] bg-transparent text-center uppercase outline-none"
                        placeholder="Leave of Absence w/o Pay"
                        {...register(`service_records.${index}.absence`)}
                        disabled={!isEditable}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Compliance Statement */}
            <p className="mt-6 text-center text-sm italic">
              Issued in compliance with Executive Order No. 54 dated August 10,
              1954, and in accordance with Circular No. 58, dated August 10,
              1954.
            </p>

            {/* Certification & Noted By Section */}
            <div className="mt-8 mb-10 flex justify-between px-10 text-center">
              <div className="w-1/2">
                <p className="mb-15 text-left text-sm font-semibold italic">
                  CERTIFIED CORRECT:
                </p>
                <hr className="mx-auto my-2 w-64 border-black" />
                <input
                  type="text"
                  className="border border-gray-300 bg-gray-100 p-2 text-center font-semibold uppercase"
                  placeholder="Divison Manager C"
                  disabled={!isEditable}
                  {...register("division_manager_c")}
                />
                <p className="text-sm">Division Manager C</p>
                <p className="text-sm">Administrative and General Services</p>
              </div>

              <div className="w-1/2">
                <p className="mb-15 text-left text-sm font-semibold italic">
                  NOTED BY:
                </p>
                <hr className="mx-auto my-2 w-64 border-black" />
                <input
                  type="text"
                  className="border border-gray-300 bg-gray-100 p-2 text-center font-semibold uppercase"
                  placeholder="General Manager"
                  disabled={!isEditable}
                  {...register("general_manager")}
                />
                <p className="text-sm">General Manager</p>
              </div>
            </div>
            <input type="submit" ref={submitRef} hidden />
          </form>

          {/* Print and Save Buttons */}
          <div className="mx-auto mt-6 flex w-[1100px] justify-end gap-4 pb-6">
            <button
              className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:bg-gray-400"
              onClick={handlePrintPDF}
              type="button"
              disabled={isSaving}
            >
              {isSaving ? "Generating PDF..." : "Generate PDF"}
            </button>

            <button
              className="rounded bg-green-500 px-6 py-2 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
              onClick={() => submitRef.current?.click()}
              type="button"
              disabled={!isEditable || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceRecordForm;
