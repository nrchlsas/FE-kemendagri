import { useState, useEffect } from "react";
import { useDateRange } from "../../context/date-range.context";

export default function DateRangeFilter() {
  const { tanggal_mulai, tanggal_akhir, setTanggalRange } = useDateRange();
  const [mulai, setMulai] = useState(tanggal_mulai);
  const [akhir, setAkhir] = useState(tanggal_akhir);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mulai || !akhir) {
      alert("Isi kedua tanggal terlebih dahulu!");
      return;
    }
    setTanggalRange({ tanggal_mulai: mulai, tanggal_akhir: akhir });
  };

  useEffect(() => {
    setMulai(tanggal_mulai);
    setAkhir(tanggal_akhir);
  }, [tanggal_mulai, tanggal_akhir]);

  return (
    <form onSubmit={handleSubmit} className="row g-3 mb-4">
      <div className="col-md-4">
        <label htmlFor="tanggalMulai" className="form-label fw-semibold">
          Tanggal Mulai
        </label>
        <input
          id="tanggalMulai"
          type="date"
          value={mulai}
          onChange={(e) => setMulai(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="col-md-4">
        <label htmlFor="tanggalAkhir" className="form-label fw-semibold">
          Tanggal Akhir
        </label>
        <input
          id="tanggalAkhir"
          type="date"
          value={akhir}
          onChange={(e) => setAkhir(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="col-md-4 d-flex align-items-end">
        <button type="submit" className="btn btn-primary w-100">
          Filter
        </button>
      </div>
    </form>
  );
}
