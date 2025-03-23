import { createContext, useContext, useState, ReactNode } from "react";

interface StatusState {
  success: boolean;
  error: boolean;
  message: string;
}

interface StatusContextType {
  status: StatusState;
  setStatus: React.Dispatch<React.SetStateAction<StatusState>>;
  resetStatus: () => void;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const StatusProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<StatusState>({
    success: false,
    error: false,
    message: "",
  });

  const resetStatus = () => {
    setStatus({
      success: false,
      error: false,
      message: "",
    });
  };

  return (
    <StatusContext.Provider value={{ status, setStatus, resetStatus }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error("useStatus must be used within a ResponseProvider");
  }
  return context;
};
