import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Function to generate the page numbers with ellipses
  const getPaginationRange = () => {
    const range = [];
    const showEllipsisStart = currentPage > 4;
    const showEllipsisEnd = totalPages - currentPage > 3;

    // Show the first page and currentPage - 1, currentPage, currentPage + 1, and last page
    if (showEllipsisStart) {
      range.push(1, "...");
    } else {
      for (let i = 1; i < currentPage; i++) {
        range.push(i);
      }
    }

    // Show current page and two pages before and after it
    range.push(
      Math.max(1, currentPage - 1),
      currentPage,
      Math.min(currentPage + 1, totalPages)
    );

    // Show the last page and currentPage + 1 if necessary
    if (showEllipsisEnd) {
      range.push("...", totalPages);
    } else {
      for (let i = currentPage + 1; i <= totalPages; i++) {
        range.push(i);
      }
    }

    return [...new Set(range)];
  };

  const paginationRange = getPaginationRange();

  return (
    <nav className="mt-3">
      <ul className="pagination justify-content-end">
        {/* Previous Button */}
        <li className={`page-item ${currentPage === 1 && "disabled"}`}>
          <button className="page-link" onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
        </li>

        {/* Page Numbers with Ellipses */}
        {paginationRange.map((page, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === page ? "active" : ""} ${page === "..." ? "disabled" : ""}`}
          >
            {page === "..." ? (
              <span className="page-link">...</span>
            ) : (
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
          <button className="page-link" onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
