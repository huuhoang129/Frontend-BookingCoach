import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";

import type { Booking } from "../../types/bookingTypes";

export function useBookingManage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/bookings");
      if (res.data.errCode === 0) setBookings(res.data.data);
    } catch (err) {
      console.error("❌ Fetch bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/bookings/${id}`
      );
      if (res.data.errCode === 0) {
        message.success("Xóa booking thành công");
        fetchBookings();
      } else message.error(res.data.errMessage);
    } catch {
      message.error("Lỗi khi xóa booking");
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/v1/bookings/${id}`,
        { status }
      );
      if (res.data.errCode === 0) {
        message.success("Cập nhật trạng thái thành công");
        fetchBookings();
      } else message.error(res.data.errMessage);
    } catch {
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // Search filter
  const filteredData = bookings.filter((b) => {
    if (!searchText) return true;
    return (
      b.customers?.some((c) =>
        c.fullName.toLowerCase().includes(searchText.toLowerCase())
      ) ||
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
