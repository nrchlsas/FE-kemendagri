import React from "react";
import { LogDetailProvider } from "../pages/KementerianDanLembaga/context/log.detail.context";
import { LogProvider } from "../pages/KementerianDanLembaga/context/log.context";
import { DateRangeProvider } from "../pages/KementerianDanLembaga/context/date-range.context";

export default function Providers({ children }) {
  return (
    <DateRangeProvider>
      <LogProvider>
        <LogDetailProvider>{children}</LogDetailProvider>
      </LogProvider>
    </DateRangeProvider>
  );
}
