import { useState } from "react";

export function useSearchKementerianLembaga() {
  const [kataKunciInput, setKataKunciInput] = useState("");
  const [kataKunciSearch, setKataKunciSearch] = useState("");

  const handleSearchSubmit = () => {
    setKataKunciSearch(kataKunciInput);
  };
  const handleClearSearch = () => {
    setKataKunciSearch("")
    setKataKunciInput("")
  }

  return {
    kataKunciInput,
    setKataKunciInput,
    handleSearchSubmit,
    kataKunciSearch,
    handleClearSearch
  };
}
