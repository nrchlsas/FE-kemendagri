import { useState, useEffect } from "react";

const API_URI = process.env.REACT_APP_API_URL_9007;

/**
 *
 * @param {string} nama_kementerian - Nama kementerian
 * @param {string} tanggal_mulai - Format: 'YYYY-MM-DD'
 * @param {string} tanggal_akhir - Format: 'YYYY-MM-DD'
 * @returns {object} data, loading, error
 */
export function useGetAplikasiByKementerian(
  nama_kementerian,
  tanggal_mulai,
  tanggal_akhir
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nama_kementerian) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URI}/v2/monitor-aplikasi-list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_kementerian,
            tanggal_mulai: tanggal_mulai || getToday(),
            tanggal_akhir: tanggal_akhir || getToday(),
          }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Gagal ambil data");

        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nama_kementerian, tanggal_mulai, tanggal_akhir]);

  return { data, loading, error };
}

// Helper default date: hari ini (YYYY-MM-DD)
function getToday() {
  return new Date().toISOString().split("T")[0];
}
