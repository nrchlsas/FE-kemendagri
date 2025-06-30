import { useParams } from "react-router-dom";
import { useGetAplikasiByKementerian } from "./hooks/useGetAplikasiByKementerian";
import HeaderKl from "../components/header.kl";
import { Card, CardBody, Col, Row } from "reactstrap";
import CardMonitoring from "./_components/card.component";
import LoadingSpinner from "../components/loading";
import { useDateRange } from "../context/date-range.context";
import BackButton from "../components/back.button";
import SearchInput from "../components/search.input";
import { useLog } from "../context/log.context";
import { useState } from "react";
import { useSearchAplikasi } from "./hooks/useSearchAplikasi";

export default function ComponentKementerianDanLembaga() {
  const { nama_kementerian } = useParams();
  const { tanggal_mulai, tanggal_akhir } = useDateRange();
  const {
    kataKunciInput,
    setKataKunciInput,
    handleSearchSubmit,
    kataKunciSearch,
    handleClearSearch,
  } = useSearchAplikasi();
  const decodedKementerian = decodeURIComponent(nama_kementerian || "");

  const { data, loading, error } = useGetAplikasiByKementerian(
    decodedKementerian,
    tanggal_mulai,
    tanggal_akhir,
    kataKunciSearch // ✅ hanya trigger saat user tekan cari
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
      <BackButton />
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
          <div className="mb-2 d-flex justify-content-start">
            <div className="w-100 w-md-auto" style={{ maxWidth: "300px" }}>
              <SearchInput
                onChange={(e) => setKataKunciInput(e.target.value)}
                value={kataKunciInput}
                placeholder="cari data aplikasi"
                onSubmit={handleSearchSubmit}
                onClear={handleClearSearch}
              />
            </div>
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
                    namaKementerian={decodedKementerian}
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
