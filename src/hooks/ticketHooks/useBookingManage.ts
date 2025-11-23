// src/hooks/ticketHooks/useBookingManage.ts
import { useEffect, useState } from "react";
import { message } from "antd";

import type { Booking } from "../../types/bookingTypes";
import {
  getAllBookings,
  deleteBooking,
  updateBooking,
} from "../../services/bookingServices/bookingServices";

export function useBookingManage() {
  // Danh sách booking
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Từ khóa tìm kiếm
  const [searchText, setSearchText] = useState("");

  // Modal và booking đang chọn
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Lấy danh sách booking từ server
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      if (res.data.errCode === 0) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách booking:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách booking khi mở trang
  useEffect(() => {
    fetchBookings();
  }, []);

  // Xóa booking
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteBooking(id);
      if (res.data.errCode === 0) {
        message.success("Xóa booking thành công");
        fetchBookings();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {
      message.error("Lỗi khi xóa booking");
    }
  };

  // Cập nhật trạng thái booking
  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await updateBooking({ id, status });

      if (res.data.errCode === 0) {
        message.success("Cập nhật trạng thái thành công");
        fetchBookings();
      } else {
        message.error(res.data.errMessage);
      }
    } catch {
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = bookings.filter((b) => {
    if (!searchText) return true;

    const lower = searchText.toLowerCase();
    return (
      b.customers?.some((c) => c.fullName.toLowerCase().includes(lower)) ||
      String(b.id).includes(searchText) ||
      String(b.totalAmount).includes(searchText)
    );
  });

  return {
    bookings,
    loading,
    searchText,
    setSearchText,
    filteredData,
    isModalOpen,
    setIsModalOpen,
    selectedBooking,
    setSelectedBooking,
    fetchBookings,
    handleDelete,
    handleStatusChange,
  };
}
