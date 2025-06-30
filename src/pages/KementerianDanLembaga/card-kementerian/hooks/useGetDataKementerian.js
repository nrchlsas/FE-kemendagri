import { useEffect, useState } from "react";
import { useDateRange } from "../../context/date-range.context";

const API_URI_RBAC = process.env.REACT_APP_API_URL_9007;

export function useGetDataKementerian(kataKunci) {
  const { tanggal_mulai, tanggal_akhir } = useDateRange();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URI_RBAC}/v2/monitor-kementerian-list`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kata_kunci: kataKunci,
              tanggal_mulai,
              tanggal_akhir,
            }),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kataKunci, tanggal_mulai, tanggal_akhir]);

  return { data, loading, error };
}
