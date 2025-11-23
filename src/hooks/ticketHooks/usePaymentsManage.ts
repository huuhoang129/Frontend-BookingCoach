// src/hooks/ticketHooks/usePaymentsManage.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";

export interface Payment {
  id: number;
  bookingId: number;
  method: "CASH" | "BANKING" | "VNPAY";
  status: "PENDING" | "SUCCESS" | "FAILED";
  amount: string;
  transactionCode?: string;
  paidAt?: string;
  booking?: { bookingCode: string };
}

export function usePayments() {
  // Danh sách thanh toán
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  // Tìm kiếm
  const [searchText, setSearchText] = useState("");

  // Modal và item đang chọn
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Lấy toàn bộ danh sách thanh toán
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/bookings/payments/all"
      );

      if (res.data.errCode === 0) {
        setPayments(res.data.data);
      }
    } catch {
      message.error("Không thể tải danh sách thanh toán");
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu khi mở trang
  useEffect(() => {
    fetchPayments();
  }, []);

  // Cập nhật trạng thái thanh toán
  const handleStatusChange = async (paymentId: number, status: string) => {
    try {
      const res = await axios.put(
        "http://localhost:8080/api/v1/bookings/payments/status",
        { paymentId, status }
      );

      if (res.data.errCode === 0) {
        message.success("Cập nhật trạng thái thành công");
        fetchPayments();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // Lọc danh sách theo từ khóa
  const filteredData = payments.filter((p) => {
    if (!searchText) return true;

    const lower = searchText.toLowerCase();
    return (
      String(p.id).includes(searchText) ||
      String(p.bookingId).includes(searchText) ||
      p.method.toLowerCase().includes(lower)
    );
  });

  return {
    payments,
    loading,
    searchText,
    setSearchText,
    filteredData,
    isModalOpen,
    setIsModalOpen,
    selectedPayment,
    setSelectedPayment,
    handleStatusChange,
  };
}
