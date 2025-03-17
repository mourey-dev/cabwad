import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../instance";

// Generic types for the hooks
type QueryConfig = {
  staleTime?: number;
  cacheTime?: number;
  enabled?: boolean;
};

// Custom hook for GET requests
export const useGetQuery = <TData>(
  queryKey: string[],
  url: string,
  config?: QueryConfig,
) => {
  return useQuery<TData>({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get(url);
      return response.data;
    },
    staleTime: config?.staleTime ?? 5 * 60 * 1000, // 5 minutes
    gcTime: config?.cacheTime ?? 30 * 60 * 1000, // 30 minutes
    enabled: config?.enabled ?? true,
  });
};

// Custom hook for POST requests
export const useCreateMutation = <TData, TVariables>(
  url: string,
  queryKey: string[],
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TVariables) => {
      const response = await axiosInstance.post(url, data);
      return response.data as TData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

// Custom hook for PUT requests
export const useUpdateMutation = <TData, TVariables>(
  url: string,
  queryKey: string[],
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: TVariables;
    }) => {
      const response = await axiosInstance.put(`${url}/${id}`, data);
      return response.data as TData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

// Custom hook for DELETE requests
export const useDeleteMutation = <TData>(url: string, queryKey: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await axiosInstance.delete(`${url}`, {
        data: { employee_id: id },
      });
      return response.data as TData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
