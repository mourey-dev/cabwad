import { useState } from "react";
import axiosInstance from "../instance";
import { AxiosRequestConfig } from "axios";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestConfig<TData>
  extends Omit<AxiosRequestConfig, "method" | "data"> {
  method: HttpMethod;
  data?: TData;
}

const useRequest = <TResponse, TData = unknown>(
  path: string,
  defaultConfig?: Partial<RequestConfig<TData>>,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [response, setResponse] = useState<TResponse | null>(null);

  const handleRequest = async (
    data?: TData,
    config?: Partial<RequestConfig<TData>>,
  ) => {
    setLoading(true);
    setError(false);
    setErrorMessage("");

    const finalConfig: RequestConfig<TData> = {
      method: "POST",
      ...defaultConfig,
      ...config,
      data,
    };

    try {
      const result = await axiosInstance.request<TResponse>({
        url: path,
        ...finalConfig,
      });
      setResponse(result.data);
      return result.data;
    } catch (error: any) {
      setError(true);
      console.log(error);
      setErrorMessage(error.response?.data?.detail || "An error occurred");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    errorMessage,
    response,
    setResponse,
    handleRequest,
  };
};

export default useRequest;
