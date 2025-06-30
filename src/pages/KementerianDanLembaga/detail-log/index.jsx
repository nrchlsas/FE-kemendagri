import { Card, CardBody } from "reactstrap";
import HeaderKl from "../components/header.kl";
import DataTable from "../components/data.table";
import BackButton from "../components/back.button";
import { useMonitoringTable } from "./hooks/useMonitoringTable";
import LoadingSpinner from "../components/loading";

export default function MonitoringTableKl() {
  const {
    params,
    data,
    loading,
    error,
    columns,
    pagination,
    totalPages,
    handlePageChange,
  } = useMonitoringTable();

  if (loading) {
    return (
      <div className="page-content">
        <BackButton />
        <HeaderKl
          iconClass="bi bi-clipboard-data"
          text={`Monitoring aplikasi ${params?.nama_kementerian} - ${params?.nama_aplikasi} - ${params?.nama_komponen}`}
        />
        <Card>
          <CardBody className="d-flex justify-content-center align-items-center py-5">
            <LoadingSpinner />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <BackButton />
        <HeaderKl
          iconClass="bi bi-clipboard-data"
          text={`Monitoring aplikasi ${params?.nama_kementerian} - ${params?.nama_aplikasi} - ${params?.nama_komponen}`}
        />
        <Card>
          <CardBody>
            <div className="text-danger text-center">Error: {error}</div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-content">
      <BackButton />
      <HeaderKl
        iconClass="bi bi-clipboard-data"
        text={`Monitoring aplikasi ${params?.nama_kementerian} - ${params?.nama_aplikasi} - ${params?.nama_komponen}`}
      />
      <Card>
        <CardBody>
          <DataTable
            columns={columns}
            data={data}
            currentPage={pagination.page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </CardBody>
      </Card>
    </div>
  );
}
