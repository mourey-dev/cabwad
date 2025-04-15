type ServiceRecord = {
  service_from: string;
  service_to: string;
  designation: string;
  status: string;
  salary: string;
  station: string;
  absence: string;
};

export type ServiceRecordFormType = {
  employee_id: string;
  surname: string;
  first_name: string;
  middle_name: string;
  birth_date: string;
  birth_place: string;
  service_records: ServiceRecord[];
};
