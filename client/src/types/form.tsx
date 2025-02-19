type Address = {
  house: string;
  street: string;
  subdivision: string;
  barangay: string;
  city: string;
  province: string;
  zip: number;
};

type PersonalInformation = {
  username: string;
  first_name: string;
  middle_name: string;
  name_extension: string;
  birth_date: string;
  birth_place: string;
  sex: string;
  civil_status: string;
  height: string;
  weight: string;
  blood_type: string;
  gsis_no: string;
  pagibig_no: string;
  philhealth_no: string;
  sss_no: string;
  tin_no: string;
  agency_no: string;
  citizenship: string;
  residential_address: Address;
  permanent_address: Address;
  telephone_no: string;
  mobile_no: string;
  email: string;
};

type FamilyBackground = {
  spouse_surname: string;
  spouse_first_name: string;
  spouse_middle_name: string;
  spouse_name_extension: string;
  spouse_occupation: string;
  spouse_employer: string;
  spouse_business_address: string;
  spouse_telephone_no: string;
  father_surname: string;
  father_first_name: string;
  father_middle_name: string;
  father_name_extension: string;
  mother_maiden_name: string;
  mother_surname: string;
  mother_first_name: string;
  mother_middle_name: string;
  childrens: Array<{ name: string; birth_date: string }>;
};

type School = {
  name: string;
  degree: string;
  period_from: string;
  period_to: string;
  units_earned: string;
  year_graduated: string;
  honors_received: string;
  date: string;
};

type EducationBackground = {
  elementary: School;
  secondary: School;
  vocational: School;
  college: School;
  graduate_studies: School;
};

type CivilServiceEligibility = Array<{
  career_service: string;
  rating: string;
  examination_date: string;
  examination_place: string;
  license_number: string;
  license_validity: string;
}>;

type WorkExperience = Array<{
  inclusive_from: string;
  inclusive_to: string;
  position_title: string;
  department: string;
  monthly_salary: number;
  salary_grade: number;
  status: string;
  gov_service: string;
  date: string;
}>;

type VoluntaryWork = Array<{
  organization: string;
  inclusive_from: string;
  inclusive_to: string;
  hours: number;
  position: string;
}>;

type LearningDevelopment = Array<{
  title: string;
  inclusive_from: string;
  inclusive_to: string;
  hours: string;
  type: string;
  conducted: string;
}>;

type OtherInformation = {
  skills: Array<{
    special_skill: string;
    recognition: string;
    membership: string;
  }>;
  third_degree: string;
  fourth_degree: string;
  degree_details: string;
  found_guilty: string;
  guilty_details: string;
  criminally_charged: string;
  criminally_filed: string;
  criminally_status: string;
  convicted: string;
  convicted_details: string;
  service_separated: string;
  service_separated_details: string;
  national_candidate: string;
  national_candidate_details: string;
  government_resign: string;
  government_resign_details: string;
  immigrant: string;
  immigrant_details: string;
  indigenous: string;
  indigenous_details: string;
  disabled_person: string;
  disabled_person_details: string;
  solo_parent: string;
  solo_parent_details: string;

  references: Array<{
    name: string;
    address: string;
    telephone_no: string;
  }>;
  government_issued_id: string;
  id_no: string;
  issuance: string;
  profile: File;
};

type FillDate = {
  form_one: string;
  form_two: string;
  form_three: string;
};

export type PDSForm = {
  personal_information: PersonalInformation;
  family_background: FamilyBackground;
  educational_background: EducationBackground;
  civil_service_eligibility: CivilServiceEligibility;
  work_experience: WorkExperience;
  voluntary_work: VoluntaryWork;
  learning_development: LearningDevelopment;
  other_information: OtherInformation;
  fill_date: FillDate;
};

export default PDSForm;
