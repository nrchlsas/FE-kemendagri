import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import HeaderKl from "../components/header.kl";
import DataTable from "../components/data.table";
import { useGetLogByParams } from "./hooks/useGetLogByParams";
import { useLog } from "../context/log.context";
import BackButton from "../components/back.button";

export default function MonitoringTableKl() {
  const { params, pagination, setPagination } = useLog();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params) {
      navigate("/");
    }
  }, [params, navigate]);

  const requestParams = useMemo(
    () => ({
      ...params,
      perpage: pagination.page.toString(), // ⬅️ perpage = nomor halaman (misal: "76")
      limit: pagination.limit.toString(), // ⬅️ limit = jumlah data per halaman
    }),
    [params, pagination]
  );

  const { data, meta, loading, error } = useGetLogByParams(requestParams);

  const totalPages =
    meta?.total_data && pagination.limit
      ? Math.ceil(meta.total_data / pagination.limit)
      : 1;

  const columns = [
    { key: "end_point", label: "Endpoint" },
    { key: "data_tarik", label: "Data" },
    { key: "tahun", label: "Tahun" },
    { key: "nama_daerah", label: "Nama Daerah" },
    { key: "created_at", label: "Waktu" },
  ];

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="page-content">
      <BackButton />
      <HeaderKl
        iconClass="bi bi-clipboard-data"
        text={
          `Monitoring aplikasi ${params?.nama_kementerian} - ${params?.nama_aplikasi} - ${params?.nama_komponen}` ||
          ""
        }
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
            <div>
              <DataTable
                columns={columns}
                data={data}
                meta={meta}
                currentPage={pagination.page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
