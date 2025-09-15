import React from "react";
import "../../styles/Table/Table.scss";

// Props
interface BaseTableProps {
  children: React.ReactNode;
}

// Component: BaseTable
const BaseTable: React.FC<BaseTableProps> = ({ children }) => {
  return <table className="base-table">{children}</table>;
};

export default BaseTable;
