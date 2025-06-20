import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import HeaderKl from "../components/header.kl";
import DataTable from "../components/data.table";

import { useLog } from "../context/log.context";
import { useGetLogByParams } from "../tabel-monitoring/hooks/useGetLogByParams";

export default function MonitoringTableKl() {
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

  const columns = [
    { key: "end_point", label: "Endpoint" },
    {
      key: "tahun_data",
      label: "Tahun Data",
      render: (row) => `${row.data_tarik || "-"} - ${row.tahun || "-"}`,
    },
    { key: "created_at", label: "Waktu Tarik" },
  ];

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="page-content">
      <HeaderKl
        iconClass="bi bi-clipboard-data"
        text={`Monitoring aplikasi ${params?.nama_kementerian} - ${params?.nama_aplikasi} - ${params?.nama_komponen}`}
      />
      <Card>
        <CardBody>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-danger text-center">Error: {error}</div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={data}
                currentPage={pagination.page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
              <div className="text-muted mt-2">
                Page {pagination.page} of {totalPages}
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
