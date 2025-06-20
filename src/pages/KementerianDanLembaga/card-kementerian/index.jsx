import { useState } from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import CardKementerian from "./_components/card.kementerian";
import { useGetDataKementerian } from "./hooks/useGetDataKementerian";
import HeaderKl from "../components/header.kl";
import LoadingSpinner from "../components/loading";
import DateRangeFilter from "./_components/date.range.filter";

export default function CardKementerianDanLembaga() {
  const [filters, setFilters] = useState({
    tangga_mulai: "",
    tangga_akhir: "",
  });

  const {
    data: dataKementerian,
    loading,
    error,
  } = useGetDataKementerian(filters.tangga_mulai, filters.tangga_akhir);

  const mappedData =
    dataKementerian?.data?.map((item) => ({
      title: item.nama_kementerian,
      desc: `Jumlah Aktivitas: ${item.jumlah_aktifitas}`,
    })) || [];

  return (
    <Card>
      <CardBody>
        <div className="separator mb-3">
          <h4 className="card-title d-flex justify-content-start">
            Monitoring Integrasi Kementerian dan Lembaga
          </h4>
        </div>

        <DateRangeFilter onFilter={setFilters} />

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-danger">Gagal mengambil data: {error}</p>
        ) : mappedData.length === 0 ? (
          <p className="text-muted text-center">
            Data tidak ditemukan untuk rentang tanggal tersebut.
          </p>
        ) : (
          <Row>
            {mappedData.map((item, index) => (
              <Col key={index} lg="4" md="6" sm="12" className="mb-3">
                <CardKementerian title={item.title} desc={item.desc} />
              </Col>
            ))}
          </Row>
        )}
      </CardBody>
    </Card>
  );
}
