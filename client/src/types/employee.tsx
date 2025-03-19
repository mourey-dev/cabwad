export type DeleteEmployeeResponse = {
  detail: string;
  employee: EmployeeData;
};

export type PaginatedEmployeesData = {
  status: string;
  message: string;
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  total_pages: number;
  current_page: number;
  results: EmployeeData[];
};

export type EmployeeFile = {
  name: string;
  file_id: string;
  file_type: string;
};

export type EmployeeData = {
  employee_id: string;
  first_name: string;
  surname: string;
  middle_name: string;
  position: string;
  department: string;
  files: Array<EmployeeFile>;
  birth_date: string;
  sex: string;
  civil_status: string;
  civil_service: string;
  appointment_status: string;
  first_day_service: string;
  phone: string;
  email: string;
  folder_id: string;
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

export type FileResponse = {
  detail: string;
  employee_file: EmployeeFile;
};

export type FileUploadPayload = {
  file_type: string;
  payload: {
    fileName: string;
    fileType: string;
    fileContent: string;
  };
  employee: EmployeeData;
};

export enum FileType {
  csc = "Certificate of CSC Eligibility",
  dca = "Diplomas, Commendations and Awards",
  mco = "Marriage Contract",
  mce = "Marriage Certificate",
  nbi = "NBI Clearance",
  pds = "Personal Data Sheet",
  bc = "Birth Certificate",
  rb = "Resume, Biodata",
  bcc = "Birth Certificate of Child/ren",
  tor = "Transcript of Records",
  form137 = "Form 137",
  form138 = "Form 138-A",
  dl = "Driver's License (Photocopy)",
  prc = "PRC License (Photocopy)",
  tc = "Training Certificate",
  a = "Appointments",
  aod = "Assumption of Duty",
  colb = "Certificate of Leave Balances",
  cos = "Contract of Services",
  cda = "Copies of Disciplinary Actions",
  nosa = "Notice of Salary Adjustment/Step Increment",
  oo = "Oath of Office",
  pdf = "Position Description Forms",
  sss = "SSS",
  pi = "Pag-Ibig",
  p = "Philhealth",
  tin = "TIN No.",
}
