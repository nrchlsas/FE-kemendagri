import { useParams } from "react-router-dom";
import { useGetAplikasiByKementerian } from "./hooks/useGetAplikasiByKementerian";
import HeaderKl from "../components/header.kl";
import { Card, CardBody, Col, Row } from "reactstrap";
import CardMonitoring from "./_components/card.component";
import LoadingSpinner from "../components/loading";
import { useDateRange } from "../context/date-range.context";

export default function ComponentKementerianDanLembaga() {
  const { nama_kementerian } = useParams();
  const { tanggal_mulai, tanggal_akhir } = useDateRange();

  const decodedKementerian = decodeURIComponent(nama_kementerian || "");

  const { data, loading, error } = useGetAplikasiByKementerian(
    decodedKementerian,
    tanggal_mulai,
    tanggal_akhir
  );

  const mappedData =
    data?.map((item) => ({
      namaAplikasi: item.nama_aplikasi || "Tanpa Nama",
      namaKementerian: item.nama_kementerian || "Tanpa Nama",
      namaKomponen: item.nama_komponen || "Tidak ada komponen",
      jumlahAktifitas: item.jumlah_aktifitas || "0",
    })) || [];

  return (
    <div className="page-content">
      <HeaderKl
        iconClass="bx bxs-dashboard"
        text={`Kementerian dan Lembaga - ${decodedKementerian}`}
      />
      <Card>
        <CardBody>
          <div className="separator mb-3">
            <h4 className="card-title d-flex justify-content-start">
              Monitoring Integrasi Aplikasi {decodedKementerian}
            </h4>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : (
            <Row>
              {mappedData.map((item, index) => (
                <Col key={index} lg="4" md="6" sm="12" className="mb-3">
                  <CardMonitoring
                    namaAplikasi={item.namaAplikasi}
                    namaKementerian={item.namaKementerian}
                    namaKomponen={item.namaKomponen}
                    jumlahAktifitas={item.jumlahAktifitas}
                  />
                </Col>
              ))}
            </Row>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
