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
};
