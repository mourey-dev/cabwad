import { useState } from "react";
import axiosInstance from "../instance";

const usePost = (path: string, data: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [response, setResponse] = useState<any>(null);

  const handlePost = async () => {
    setLoading(true);
    setError(false);
    setErrorMessage("");
    try {
      const result = await axiosInstance.post(path, data);
      setResponse(result.data);
    } catch (error: any) {
      setError(true);
      setErrorMessage(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, errorMessage, response, handlePost };
};

export default usePost;
