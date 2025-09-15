import { useState, useEffect } from "react";

/**
 * Generic pagination hook
 * @param items - data list
 * @param itemsPerPage - number of elements per page
 */
export function usePagination<T>(items: T[], itemsPerPage: number) {
  // State
  const [currentPage, setCurrentPage] = useState(1);

  // total number of pages
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Effect: nếu currentPage > totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [items, totalPages, currentPage]);

  // Calculate display data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = items.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Return API
  return {
    currentPage,
    totalPages,
    displayedItems,
    handlePageChange,
    setCurrentPage,
  };
}
