import React from "react";
import { Pagination } from "antd";

interface PaginationComponentProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

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
