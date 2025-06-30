import { createContext, useContext, useState } from "react";

const LogContext = createContext();

export function LogProvider({ children }) {
  const [params, setParams] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
  });
  const [kataKunci, setKataKunci] = useState("");
  const [fisrtPage, setFirstPage] = useState("");
  const [lastPage, setLastPage] = useState("");

  return (
    <LogContext.Provider
      value={{
        params,
        setParams,
        pagination,
        setPagination,
        kataKunci,
        setKataKunci,
        fisrtPage,
        setFirstPage,
        lastPage,
        setLastPage,
      }}
    >
      {children}
    </LogContext.Provider>
  );
}

export function useLog() {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error("useLog must be used within a LogProvider");
  }
  return context;
}
