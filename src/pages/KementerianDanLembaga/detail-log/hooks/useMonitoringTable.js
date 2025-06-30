import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useLog } from "../../context/log.context";
import { useGetLogByParams } from "../../tabel-monitoring/hooks/useGetLogByParams";

export function useMonitoringTable() {
  const { params, pagination, setPagination } = useLog();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params) navigate("/");
  }, [params, navigate]);

  const requestParams = useMemo(
    () => ({
      ...params,
      perpage: pagination.page,
      limit: pagination.limit,
    }),
    [params, pagination]
  );

  const { data, meta, loading, error } = useGetLogByParams(requestParams);

  const totalPages =
    meta?.total_data && meta.limit
      ? Math.ceil(meta.total_data / meta.limit)
      : 1;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const columns = [
    { key: "end_point", label: "Endpointtttt" },
    {
      key: "tahun_data",
      label: "Tahun Data",
      render: (row) => `${row.data_tarik || "-"} - ${row.tahun || "-"}`,
    },
    { key: "nama_daerah", label: "Nama Daerah" },
    { key: "created_at", label: "Waktu Tarik" },
  ];

  return {
    params,
    data,
    meta,
    loading,
    error,
    columns,
    pagination,
    totalPages,
    handlePageChange,
  };
}
