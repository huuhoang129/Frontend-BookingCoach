import { useState, useEffect } from "react";

/**
 * Hook phân trang chung
 * @param items - danh sách dữ liệu
 * @param itemsPerPage - số phần tử trên mỗi trang
 */
export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Nếu currentPage > totalPages (khi xóa bớt item), đưa currentPage về trang cuối
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [items, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    displayedItems,
    handlePageChange,
    setCurrentPage,
  };
}
