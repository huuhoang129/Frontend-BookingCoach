import React from "react";
import { Pagination } from "antd";

// Props
interface PaginationComponentProps {
  totalItems: number; // tổng số item
  itemsPerPage: number; // số item mỗi trang
  currentPage: number; // trang hiện tại
  onPageChange: (page: number) => void; // callback khi đổi trang
}

// Component: PaginationComponent
const PaginationComponent: React.FC<PaginationComponentProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  return (
    <Pagination
      current={currentPage}
      total={totalItems}
      pageSize={itemsPerPage}
      onChange={onPageChange}
      showSizeChanger={false}
      showQuickJumper
      style={{ marginTop: "20px", textAlign: "center" }}
    />
  );
};

export default PaginationComponent;
