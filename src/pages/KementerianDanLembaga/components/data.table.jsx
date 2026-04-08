import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogDetail } from "../context/log.detail.context";
import { useLog } from "../context/log.context";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export default function DataTable({
  columns,
  data,
  currentPage,
  totalPages,
  handlePageChange,
  linkRowlast = false,
}) {
  const [selectedColumn, setSelectedColumn] = useState("");

  const { setParams: setDetailParams, setPagination: setDetailPagination } =
    useLogDetail();
  const { kataKunci, setKataKunci, setParams, params, setPagination } =
    useLog();

  const handleDetailClick = (row) => {
    setDetailParams({
      nama_kementerian: row.nama_kementerian,
      nama_aplikasi: row.nama_aplikasi,
      nama_komponen: row.nama_komponen,
      tahun: row.tahun,
    });
    setDetailPagination({ page: 1, limit: 10 });
  };

  const handleSearchFilterSubmit = () => {
    setParams({
      ...params,
      kata_kunci: kataKunci,
      field: selectedColumn,
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setKataKunci("");
    setSelectedColumn("");
    setParams({
      ...params,
      kata_kunci: "",
      field: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const meta = data?.meta || {};
  let tableData = Array.isArray(data) ? data : data?.data || [];

  return (
    <div className="mt-4">
      {/* 🔽 Filter Per Kolom */}
      <div className="d-flex gap-2 mb-3 align-items-center flex-wrap">
        <select
          className="form-select"
          style={{ maxWidth: "200px" }}
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
        >
          <option value="">Pilih Kolom</option>
          {columns.map((col, idx) => (
            <option key={idx} value={col.key}>
              {col.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "250px" }}
          placeholder="Masukkan kata kunci"
          value={kataKunci}
          onChange={(e) => setKataKunci(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={handleSearchFilterSubmit}
          disabled={!selectedColumn || !kataKunci}
        >
          Cari
        </button>

        {(selectedColumn || kataKunci) && (
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleClearSearch}
          >
            Reset Filter Kolom
          </button>
        )}
      </div>

      {/* 📋 Tabel */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th className="text-center">No</th>
              {columns.map((col, idx) => (
                <th key={idx} className="text-center">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center text-muted"
                >
                  No data found
                </td>
              </tr>
            ) : (
              tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="text-center">
                    {(meta?.perpage || 0) * (currentPage - 1) + rowIndex + 1}
                  </td>
                  {columns.map((col, colIndex) => {
                    const isLastColumn = colIndex === columns.length - 1;
                    const value = col.render
                      ? col.render(row)
                      : col.key === "created_at" || col.key === "waktu_tarik"
                      ? new Date(row[col.key]).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          timeZone: "Asia/Jakarta",
                        })
                      : row[col.key] ?? "-";

                    return (
                      <td key={colIndex} className="text-center">
                        {linkRowlast && isLastColumn ? (
                          <Link
                            to="/detail-log"
                            onClick={() => handleDetailClick(row)}
                            className="text-decoration-none text-primary"
                          >
                            {value}
                          </Link>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      {totalPages > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted">Total Data: {meta.total_data}</span>
          <Pagination className="mb-0">
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink onClick={() => handlePageChange(1)}>
                First Page
              </PaginationLink>
            </PaginationItem>

            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </PaginationLink>
            </PaginationItem>

            <PaginationItem disabled={currentPage === meta.total_page}>
              <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </PaginationLink>
            </PaginationItem>

            <PaginationItem disabled={currentPage === meta.total_page}>
              <PaginationLink onClick={() => handlePageChange(meta.total_page)}>
                Last Page
              </PaginationLink>
            </PaginationItem>
          </Pagination>
        </div>
      )}
    </div>
  );
}
