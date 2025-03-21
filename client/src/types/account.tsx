export type AccountType = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  user_type: string;
};

export type AccountResponse = {
  status: string;
  message: string;
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  total_pages: number;
  current_page: number;
  results: AccountType[];
};

export type AccountFilters = {
  is_active?: boolean;
  user_type?: "Super Admin" | "Admin" | "Staff";
  page?: number;
  page_size?: number;
};
