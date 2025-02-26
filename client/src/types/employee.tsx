export type EmployeeData = {
  id: number;
  first_name: string;
  surname: string;
  position: string;
  department: string;
};

export type EmployeesData = EmployeeData[];

export type EmployeeCount = {
  total_permanent: number;
  total_casual: number;
  total_job_order: number;
  total_co_terminus: number;
  total_contract_of_service: number;
  total_temporary: number;
};
