import { useEffect, useState } from "react";
import { Dropdown } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import {
  getAllAccounts,
  lockAccount,
  unlockAccount,
} from "../../../services/userServices/accountServices.ts";
import LockButton from "../../../components/ui/Button/Lock";
import UnlockButton from "../../../components/ui/Button/Unlock";
import BaseTable from "../../../components/ui/Table/Table";
import Pagination from "../../../components/ui/Pagination/Pagination";

interface Account {
  id: number;
  email: string;
  role: string;
  status: string;
}

export default function AccountManage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await getAllAccounts();
      const users: Account[] = res.data.data || [];
      setAccounts(users);
    } catch (err) {
      console.error("❌ Lỗi khi fetch accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleLock = async (id: number) => {
    try {
      await lockAccount(id);
      fetchAccounts();
    } catch (err) {
      console.error("❌ Lỗi khi khóa tài khoản:", err);
    }
  };

  const handleUnlock = async (id: number) => {
    try {
      await unlockAccount(id);
      fetchAccounts();
    } catch (err) {
      console.error("❌ Lỗi khi mở khóa tài khoản:", err);
    }
  };

  // Lọc theo role
  const filteredAccounts = roleFilter
    ? accounts.filter((acc) => acc.role === roleFilter)
    : accounts;

  // Phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccounts = filteredAccounts.slice(startIndex, endIndex);

  // Menu filter role (chuẩn v5)
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
      <div>
        <h2>Quản Lý Tài Khoản</h2>
      </div>
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
