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
      // Update the cache directly
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
    },
  });
};

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
      // Update cache by removing the deleted file
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
    },
  });
};

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
    },
  });
};
