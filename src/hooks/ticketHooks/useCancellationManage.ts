//src/hooks/ticketHooks/useCancellationManage.ts
import { useEffect, useState } from "react";
import { AppNotification } from "../../components/Notification/AppNotification";
import {
  getAllCancellations,
  updateCancellation,
  deleteCancellation,
} from "../../services/bookingServices/cancellationServices.ts";
import type { Cancellation } from "../../types/cancellation";

export function useCancellationManage() {
  // Danh sách yêu cầu hủy
  const [data, setData] = useState<Cancellation[]>([]);
  const [loading, setLoading] = useState(false);

  // Bộ lọc
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterRefund, setFilterRefund] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  // Notification (thông báo)
  const { notifySuccess, notifyError, contextHolder } = AppNotification();

  // Tải danh sách yêu cầu hủy
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllCancellations();

      if (res.data.errCode === 0) {
        setData(res.data.data);
      } else {
        notifyError("Không thể tải danh sách", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu ban đầu
  useEffect(() => {
    fetchData();
  }, []);

  // Áp dụng bộ lọc tìm kiếm
  const filteredData = data.filter((item) => {
    const keyword = searchText.toLowerCase().trim();

    const matchKeyword =
      !keyword ||
      item.bookingCode.toLowerCase().includes(keyword) ||
      `${item.user?.firstName} ${item.user?.lastName}`
        .toLowerCase()
        .includes(keyword);

    const matchStatus = !filterStatus || item.status === filterStatus;
    const matchRefund = !filterRefund || item.refundMethod === filterRefund;

    return matchKeyword && matchStatus && matchRefund;
  });

  // Xóa yêu cầu hủy
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteCancellation(id);
      if (res.data.errCode === 0) {
        notifySuccess("Xóa yêu cầu thành công", res.data.errMessage);
        fetchData();
      } else {
        notifyError("Xóa thất bại", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi khi xóa yêu cầu");
    }
  };

  // Cập nhật trạng thái yêu cầu
  const handleStatusUpdate = async (
    id: number,
    status: string,
    adminNote?: string
  ) => {
    try {
      const res = await updateCancellation(id, { status, adminNote });

      if (res.data.errCode === 0) {
        notifySuccess("Cập nhật trạng thái thành công", res.data.errMessage);
        fetchData();
      } else {
        notifyError("Lỗi cập nhật", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi khi cập nhật");
    }
  };

  // Trả dữ liệu và hàm thao tác cho component
  return {
    data: filteredData,
    loading,
    searchText,
    setSearchText,
    filterStatus,
    setFilterStatus,
    filterRefund,
    setFilterRefund,
    handleDelete,
    handleStatusUpdate,
    contextHolder,
  };
}
