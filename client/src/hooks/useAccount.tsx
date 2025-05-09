import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "../instance";
import { AccountType, AccountResponse, AccountFilters } from "../types/account";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export const useAccounts = (filters?: AccountFilters) => {
  return useQuery({
    queryKey: ["accounts", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.is_active !== undefined) {
        params.append("is_active", String(filters.is_active));
      }
      if (filters?.user_type) {
        params.append("user_type", filters.user_type);
      }
      if (filters?.page) {
        params.append("page", String(filters.page));
      }
      if (filters?.page_size) {
        params.append("page_size", String(filters.page_size));
      }

      const response = await axiosInstance.get<AccountResponse>(
        `/account/?${params.toString()}`,
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useAccount = (accountId?: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["account", accountId] as const,
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<AccountType>>(
        `/account/${accountId}/`,
      );
      return response.data.data;
    },
    enabled: !!accountId,
    initialData: () => {
      const accountsData = queryClient.getQueryData<AccountResponse>([
        "accounts",
      ]);
      return accountsData?.results?.find((acc) => acc.id === Number(accountId));
    },
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<AccountType, "id">) => {
      const response = await axiosInstance.post<ApiResponse<AccountType>>(
        "/account/list/",
        data,
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Update the cached data
      queryClient.setQueryData<AccountResponse>(
        ["accounts", { is_active: true }], // Match your current filter
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            count: (oldData.count || 0) + 1,
            results: [response.data, ...(oldData.results || [])],
          };
        },
      );
    },
    onError: (error: Error) => {
      throw new Error(`Failed to create account: ${error.message}`);
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AccountType) => {
      const response = await axiosInstance.put<ApiResponse<AccountType>>(
        "/account/",
        data,
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({
        queryKey: ["account", String(variables.id)],
      });
      return data;
    },
    onError: (error: Error) => {
      throw new Error(`Failed to update account: ${error.message}`);
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete<
        ApiResponse<{
          id: number;
          is_active: boolean;
        }>
      >("/account/list/", {
        data: { id },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      return data;
    },
    onError: (error: Error) => {
      throw new Error(`Failed to delete account: ${error.message}`);
    },
  });
};

export const useToggleAccountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; is_active?: boolean }) => {
      // Use PATCH instead of PUT for partial updates
      const response = await axiosInstance.patch<ApiResponse<AccountType>>(
        "/account/list/", // Path to your endpoint
        data,
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      // COMPREHENSIVE INVALIDATION STRATEGY:

      // 1. Invalidate all account-related queries
      queryClient.invalidateQueries({ queryKey: ["accounts"] });

      // 2. Invalidate specific account by ID
      queryClient.invalidateQueries({
        queryKey: ["account", String(variables.id)],
      });

      // 3. CRITICAL FIX: Invalidate the exact pattern used in useGetQuery
      // This is the pattern you're using in your Users component
      queryClient.invalidateQueries({
        predicate: (query) => {
          // Check if it's an array query key with at least 4 items
          const queryKey = query.queryKey;
          if (!Array.isArray(queryKey) || queryKey.length < 4) {
            return false;
          }

          // If the second element is a string (isActive flag), invalidate
          if (typeof queryKey[1] === "string") {
            return true;
          }

          return false;
        },
      });

      return response;
    },
    onError: (error: any) => {
      // Enhanced error handling to extract API error messages if available
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      throw new Error(`Failed to toggle account status: ${errorMessage}`);
    },
  });
};
