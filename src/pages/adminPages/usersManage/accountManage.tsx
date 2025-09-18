import { useState } from "react";
import { Dropdown } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import LockButton from "../../../components/ui/Button/Lock";
import UnlockButton from "../../../components/ui/Button/Unlock";
import BaseTable from "../../../components/ui/Table/Table";
import Pagination from "../../../components/ui/Pagination/Pagination";
import { useAccounts } from "../../../hooks/useAccounts";

export default function AccountManage() {
  const { accounts, loading, handleLock, handleUnlock } = useAccounts();

  const [roleFilter, setRoleFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Lọc theo role
  const filteredAccounts = roleFilter
    ? accounts.filter((acc) => acc.role === roleFilter)
    : accounts;

  // Phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAccounts = filteredAccounts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Menu filter
  const roleMenu = {
    items: [
      { key: "", label: "Tất cả" },
      { key: "Admin", label: "Admin" },
      { key: "Client", label: "Client" },
      { key: "Staff", label: "Staff" },
    ],
    onClick: ({ key }: { key: string }) => {
      setRoleFilter(key);
      setCurrentPage(1);
    },
  };

  return (
    <div className="panel-account-admin">
      <h2>Quản Lý Tài Khoản</h2>
      <BaseTable>
        <thead>
          <tr>
            <th style={{ width: "350px" }}>Email</th>
            <th style={{ width: "100px" }}>
              Vai trò{" "}
              <Dropdown menu={roleMenu} trigger={["click"]}>
                <FilterOutlined
                  style={{
                    cursor: "pointer",
                    color: roleFilter ? "#FFFF99" : "inherit",
                  }}
                />
              </Dropdown>
            </th>
            <th style={{ width: "150px" }}>Trạng thái</th>
            <th style={{ width: "150px" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "16px" }}>
                Đang tải...
              </td>
            </tr>
          ) : currentAccounts.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "16px" }}>
                Không có tài khoản nào
              </td>
            </tr>
          ) : (
            currentAccounts.map((account) => (
              <tr key={account.id}>
                <td>{account.email}</td>
                <td>{account.role}</td>
                <td>{account.status}</td>
                <td>
                  {account.status === "Active" ? (
                    <LockButton onClick={() => handleLock(account.id)}>
                      Khóa
                    </LockButton>
                  ) : (
                    <UnlockButton onClick={() => handleUnlock(account.id)}>
                      Mở khóa
                    </UnlockButton>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </BaseTable>
      <Pagination
        totalItems={filteredAccounts.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
