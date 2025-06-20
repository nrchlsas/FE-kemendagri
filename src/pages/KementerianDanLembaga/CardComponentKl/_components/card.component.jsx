import { Link } from "react-router-dom";
import { useLog } from "../../context/log.context";
import { useDateRange } from "../../context/date-range.context";
export default function CardMonitoring({
  namaAplikasi,
  namaKementerian,
  namaKomponen,
  jumlahAktifitas,
}) {
  const { setParams, setPagination } = useLog();
  const { tanggal_mulai, tanggal_akhir } = useDateRange();

  const handleClick = () => {
    setParams({
      nama_kementerian: namaKementerian,
      nama_aplikasi: namaAplikasi,
      nama_komponen: namaKomponen,
      tanggal_mulai: tanggal_mulai,
      tanggal_akhir: tanggal_akhir,
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <Link
      to="/table-satu"
      onClick={handleClick}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="card shadow-sm card-animate border"
        style={{ borderColor: "#dee2e6" }}
      >
        <div className="card-body text-center">
          {/* <h5 className="card-title">{namaKementerian}</h5>
          <hr /> */}
          <p className="card-text mb-1">
            <strong>Unit Kerja:</strong> {namaKomponen}
          </p>
          <p className="card-text mb-1">
            <strong>Nama Aplikasi:</strong> {namaAplikasi}
          </p>
          <p className="card-text">
            <strong>Jumlah Aktivitas:</strong> {jumlahAktifitas}
          </p>
        </div>
      </div>
    </Link>
  );
}
