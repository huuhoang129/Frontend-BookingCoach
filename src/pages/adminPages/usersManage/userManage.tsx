// UI – Table & Pagination
import BaseTable from "../../../components/ui/Table/Table";
// UI – Buttons
import DeleteButton from "../../../components/ui/Button/Delete";
import EditButton from "../../../components/ui/Button/Edit";
import { getAllUsers } from "../../../services/userServices/userService.ts";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export default function UserManage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data.data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-user-admin">
      <div>
        <h2>Quản Lý Người Dùng</h2>
      </div>
      <div>
        <BaseTable>
          <thead>
            <tr>
              <th style={{ width: "350px" }}>Email</th>
              <th>Tên đầu</th>
              <th>Tên cuối</th>
              <th>Số điện thoại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  Đang tải...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  Không có người dùng nào
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <EditButton>Sửa</EditButton>
                    <DeleteButton>Xoá</DeleteButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </BaseTable>
      </div>
    </div>
  );
}
