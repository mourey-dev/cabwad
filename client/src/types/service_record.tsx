type ServiceRecord = {
  service_from: string;
  service_to: string;
  designation: string;
  status: string;
  salary: string;
  station: string;
  absence: string;
};

export type ServiceRecordForm = {
  employee_id: string;
  surname: string;
  first_name: string;
  middle_name: string;
  date_of_birth: string;
  place_of_birth: string;
  service_records: ServiceRecord[];
};
