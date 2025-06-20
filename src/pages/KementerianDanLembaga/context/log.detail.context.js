import { createContext, useContext, useState } from "react";

const LogDetailContext = createContext();

export function LogDetailProvider({ children }) {
  const [params, setParams] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  return (
    <LogDetailContext.Provider
      value={{
        params,
        setParams,
        pagination,
        setPagination,
      }}
    >
      {children}
    </LogDetailContext.Provider>
  );
}

export function useLogDetail() {
  const context = useContext(LogDetailContext);
  if (!context) {
    throw new Error("useLogDetail must be used within LogDetailProvider");
  }
  return context;
}
