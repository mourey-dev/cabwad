import { useEffect, useState } from "react";
import axiosInstance from "../instance";

const useGet = <T,>(path: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<T | null>(null);

  const handleGet = async () => {
    setLoading(true);
    setError(false);
    setErrorMessage("");

    try {
      const result = await axiosInstance.get<T>(path);
      setData(result.data);
    } catch (error: any) {
      setError(true);
      console.log(error);
      setErrorMessage(error.response.data.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGet();
  }, [path]);

  return { loading, error, errorMessage, data, setData };
};

export default useGet;
