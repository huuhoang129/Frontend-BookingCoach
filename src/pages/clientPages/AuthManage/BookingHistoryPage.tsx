//src/pages/clientPages/AuthManage/BookingHistoryPage.tsx
import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileSidebar from "../../../components/Sider/ProfileSidebar";
import { useAuth } from "../../../hooks/AuthHooks/useAuth";
import "./InformationClientPage.scss";
import BookingDetailView from "./BookingDetailView";

export default function TripHistoryPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  useEffect(() => {
    // Kiểm tra user đang đăng nhập
    if (!currentUser?.id) {
      setBookings([]);
      return;
    }

    // Lấy danh sách lịch sử đặt vé theo người dùng
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:8080/api/v1/bookings?userId=${currentUser.id}`
        );

        if (res.data.errCode === 0) {
          setBookings(res.data.data || []);
        }
      } catch (e) {
        console.error("Lỗi lấy dữ liệu lịch sử đặt vé:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: "Mã vé",
      dataIndex: "bookingCode",
      key: "bookingCode",
      render: (t: string) => <Tag color="blue">{t}</Tag>,
    },
    {
      title: "Tuyến xe",
      key: "route",
      render: (_: any, record: any) => {
        const from = record.trip?.route?.fromLocation?.nameLocations;
        const to = record.trip?.route?.toLocation?.nameLocations;
        return (
          <>
            <EnvironmentOutlined style={{ color: "#4d940e", marginRight: 6 }} />
            {from} → {to}
          </>
        );
      },
    },
    {
      title: "Ngày đi",
      key: "startDate",
      render: (_: any, record: any) => {
        const date = record.trip?.startDate;
        return date ? new Date(date).toLocaleDateString("vi-VN") : "--";
      },
    },
    {
      title: "Ghế đã đặt",
      key: "seatInfo",
      render: (_: any, record: any) => {
        const seats = record.seats || [];
        if (seats.length === 0) return "—";
        return seats
          .map((s: any) => `${s.seat?.name} (Tầng ${s.seat?.floor || 1})`)
          .join(", ");
      },
    },
    {
      title: "Thanh toán",
      key: "paymentStatus",
      render: (_: any, record: any) => {
        const payment = Array.isArray(record.payment)
          ? record.payment[0]
          : record.payment;

        const status = payment?.status;

        const color =
          status === "SUCCESS"
            ? "green"
            : status === "PENDING"
            ? "orange"
            : "red";

        const text =
          status === "SUCCESS"
            ? "ĐÃ THANH TOÁN"
            : status === "PENDING"
            ? "ĐANG CHỜ"
            : "THẤT BẠI";

        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];
  if (selectedBooking) {
    return (
      <div className="profile-container">
        <ProfileSidebar
          activeTab="history"
          onChangeTab={(tab) => navigate(`/profile/${tab}`)}
        />

        <div className="main-content">
          <BookingDetailView
            booking={selectedBooking}
            onBack={() => setSelectedBooking(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Thanh sidebar tài khoản */}
      <ProfileSidebar
        activeTab="history"
        onChangeTab={(tab) => navigate(`/profile/${tab}`)}
      />

      <div className="main-content">
        <div className="trip-history">
          <h3>Lịch sử chuyến đi</h3>

          {/* Bảng lịch sử đặt vé */}
          <Table
            loading={loading}
            columns={columns}
            dataSource={bookings}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            onRow={(record) => ({
              onClick: () => setSelectedBooking(record),
            })}
          />
        </div>
      </div>
    </div>
  );
}
