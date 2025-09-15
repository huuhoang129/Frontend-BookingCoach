import React from "react";
import "../../styles/Table/Table.scss";

interface BaseTableProps {
  children: React.ReactNode;
}

const BaseTable: React.FC<BaseTableProps> = ({ children }) => {
  return <table className="base-table">{children}</table>;
};

export default BaseTable;
