import { useQuery, useQueryClient } from "@tanstack/react-query";
import { EmployeeData } from "../types/employee";
import axiosInstance from "../instance";

interface PaginatedEmployeesData {
  results: EmployeeData[];
}

export const useEmployeeData = (employeeId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: employee,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employee", employeeId] as const,
    queryFn: async () => {
      const response = await axiosInstance.get<EmployeeData>(
        `/employee/list/${employeeId}/`,
      );
      return response.data;
    },
    enabled: !!employeeId,
    initialData: () => {
      const employeesData = queryClient.getQueryData<PaginatedEmployeesData>([
        "employees",
      ]);
      return employeesData?.results?.find(
        (emp) => emp.employee_id === employeeId,
      );
    },
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const prefetchEmployee = (employeeData: EmployeeData) => {
    queryClient.setQueryData<EmployeeData>(
      ["employee", employeeData.employee_id],
      employeeData,
    );
  };

  return {
    employee,
    isLoading,
    isError,
    error,
    prefetchEmployee,
  };
};
