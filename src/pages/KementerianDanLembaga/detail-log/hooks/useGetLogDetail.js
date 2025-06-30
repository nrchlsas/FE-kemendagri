import { useState, useEffect } from "react";
const API_URI = process.env.REACT_APP_API_URL_9007;

export function useGetDetailLog(params) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URI}/v2/monitor-log-detail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        setData(result.data || []);
        setMeta(result.meta || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  return { data, meta, loading, error };
}
