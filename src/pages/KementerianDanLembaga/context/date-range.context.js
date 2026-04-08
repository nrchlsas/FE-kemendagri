import { createContext, useContext, useState } from "react";

function getDefaultDates() {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const format = (date) => date.toISOString().slice(0, 10);

  return {
    tanggal_mulai: format(today),
    tanggal_akhir: format(today),
  };
}

const DateRangeContext = createContext();

export const DateRangeProvider = ({ children }) => {
  const [range, setRange] = useState(getDefaultDates());

  const setTanggalRange = ({ tanggal_mulai, tanggal_akhir }) => {
    setRange({
      tanggal_mulai: tanggal_mulai || range.tanggal_mulai,
      tanggal_akhir: tanggal_akhir || range.tanggal_akhir,
    });
  };

  return (
    <DateRangeContext.Provider value={{ ...range, setTanggalRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRange = () => useContext(DateRangeContext);
