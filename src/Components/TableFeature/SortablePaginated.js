import { useState, useMemo } from 'react';

const sortablePaginatedTable = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  // Sorting logic
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort the data
  const sortedItems = useMemo(() => {
    let sortableItems = [...(data || [])];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key] || 0;
        const bValue = b[sortConfig.key] || 0;

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // Paginate the data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

  // Pagination change handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Placeholder for empty rows if data is less than items per page
  const placeholders = Array.from(
    { length: itemsPerPage - currentItems.length },
    (_, index) => (
      <tr key={`placeholder-${index}`}>
        <td colSpan="8" style={{ height: '44px', backgroundColor: '#f9f9f9' }}></td>
      </tr>
    )
  );

  // Sorting icon logic
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '↕'; // Default icon for unsorted
  };

  return {
    currentItems,
    totalPages,
    paginate,
    requestSort,
    getSortIcon,
    placeholders,
    currentPage,
    setCurrentPage,
  };
};

export default sortablePaginatedTable;
