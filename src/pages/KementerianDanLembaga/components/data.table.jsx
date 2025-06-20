import { Link } from "react-router-dom";
import { useLogDetail } from "../context/log.detail.context";

export default function DataTable({
  columns,
  data,
  currentPage,
  totalPages,
  handlePageChange,
  linkRowlast = false,
}) {
  const tableData = Array.isArray(data) ? data : data?.data || [];
  const isDisabled = currentPage === 1 || currentPage === totalPages;

  const { setParams: setDetailParams, setPagination: setDetailPagination } =
    useLogDetail();

  const handleDetailClick = (row) => {
    setDetailParams({
      nama_kementerian: row.nama_kementerian,
      nama_aplikasi: row.nama_aplikasi,
      nama_komponen: row.nama_komponen,
      tahun: row.tahun,
    });
    setDetailPagination({ page: 1, limit: 10 });
  };

  return (
    <div className="mt-4">
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
                  {/* Kolom No */}
                  <td className="text-center">
                    {(currentPage - 1) * tableData.length + rowIndex + 1}
                  </td>

                  {/* Kolom Data */}
                  {columns.map((col, colIndex) => {
                    const isLastColumn = colIndex === columns.length - 1;

                    const value = col.render
                      ? col.render(row)
                      : col.key === "created_at" || col.key === "waktu_tarik"
                      ? new Date(row[col.key]).toLocaleDateString("id-ID")
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

      {totalPages > 0 && (
        <nav className="d-flex justify-content-end">
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={isDisabled}
              >
                Previous
              </button>
            </li>

            <li className="page-item">
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
