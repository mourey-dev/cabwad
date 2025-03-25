import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { EmployeeData } from "../types/employee";
import axiosInstance from "../instance";

// Types
import { FileUploadPayload, FileResponse } from "../types/employee";

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

// Update the useUpdateEmployee hook to properly invalidate the employees list query
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      employeeData,
      employeeId,
    }: {
      employeeData: Partial<EmployeeData>;
      employeeId: string;
    }) => {
      const response = await axiosInstance.put<{
        detail: string;
        employee: EmployeeData;
      }>(`/employee/list/${employeeId}/`, employeeData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the cache for the specific employee
      queryClient.setQueryData<EmployeeData>(
        ["employee", variables.employeeId],
        (oldData) => {
          if (!oldData) return data.employee;

          return {
            ...oldData,
            ...data.employee,
          };
        },
      );

      // Invalidate the employees list to force a refetch
      queryClient.invalidateQueries({ queryKey: ["employees"] });

      // Also update the employees list if it's in the cache
      queryClient.setQueriesData<PaginatedEmployeesData>(
        { queryKey: ["employees"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            results: oldData.results.map((employee) =>
              employee.employee_id === variables.employeeId
                ? { ...employee, ...data.employee }
                : employee,
            ),
          };
        },
      );

      return data;
    },
    onError: (error: Error) => {
      console.error("Error updating employee:", error);
      throw new Error(`Failed to update employee: ${error.message}`);
    },
  });
};

// Update the useEmployeeFile hook for file uploads
export const useEmployeeFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FileUploadPayload) => {
      const response = await axiosInstance.post<FileResponse>(
        "/employee/files/",
        data,
      );
      return response.data;
    },
    onSuccess: (newData, variables) => {
      // Update the employee detail cache
      queryClient.setQueryData(
        ["employee", variables.employee.employee_id],
        (oldData: EmployeeData | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            files: [...oldData.files, newData.employee_file],
          };
        },
      );

      // Invalidate employees list queries
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

// Update the useDeleteEmployeeFile hook
export const useDeleteEmployeeFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file_id,
      employee,
    }: {
      file_id: string;
      employee: EmployeeData;
    }) => {
      const response = await axiosInstance.delete<FileResponse>(
        `/employee/files/`,
        {
          data: { file_id, employee },
        },
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Update employee detail cache
      queryClient.setQueryData(
        ["employee", variables.employee.employee_id],
        (oldData: EmployeeData | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            files: oldData.files.filter(
              (file) => file.file_id !== variables.file_id,
            ),
          };
        },
      );

      // Invalidate employees list queries
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

// Update the useUpdateEmployeeFile hook
export const useUpdateEmployeeFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file_id,
      file_type,
      payload,
      employee,
    }: {
      file_id: string;
      file_type: string;
      payload: any;
      employee: EmployeeData;
    }) => {
      const response = await axiosInstance.put<FileResponse>(
        `/employee/files/`,
        { file_id, file_type, payload, employee },
      );
      return response.data;
    },
    onSuccess: (newData, variables) => {
      // Update employee detail cache
      queryClient.setQueryData(
        ["employee", variables.employee.employee_id],
        (oldData: EmployeeData | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            files: oldData.files.map((file) =>
              file.file_id === variables.file_id ? newData.employee_file : file,
            ),
          };
        },
      );

      // Invalidate employees list queries
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useToggleEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      employeeId,
      action = "toggle",
    }: {
      employeeId: string;
      action?: "activate" | "deactivate" | "toggle";
    }) => {
      const response = await axiosInstance.patch<{
        detail: string;
        employee: EmployeeData;
      }>(`/employee/list/${employeeId}/`, {
        employee_id: employeeId,
        action,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the cache for the specific employee
      queryClient.setQueryData<EmployeeData>(
        ["employee", variables.employeeId],
        (oldData) => {
          if (!oldData) return data.employee;

          return {
            ...oldData,
            ...data.employee,
          };
        },
      );

      // IMPORTANT: Invalidate ALL employee list queries with their variations
      // This ensures both active and inactive lists get refreshed
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = Array.isArray(query.queryKey)
            ? query.queryKey[0]
            : query.queryKey;
          return queryKey === "employees";
        },
        refetchType: "all", // Force immediate refetch
      });

      return data;
    },
    onError: (error: Error) => {
      console.error("Error toggling employee status:", error);
      throw new Error(`Failed to update employee status: ${error.message}`);
    },
  });
};
