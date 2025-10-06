import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileSidebar from "../../../components/Sider/ProfileSidebar";
import { useAuth } from "../../../hooks/AuthHooks/useAuth";
import "./InformationClientPage.scss";

export default function TripHistoryPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("👤 [TripHistoryPage] currentUser:", currentUser);
    console.log("💾 [TripHistoryPage] localStorage:", { ...localStorage });

    if (!currentUser?.id) {
      setBookings([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`📡 Fetching bookings for userId=${currentUser.id}`);
        const res = await axios.get(
          `http://localhost:8080/api/v1/bookings?userId=${currentUser.id}`
        );
        if (res.data.errCode === 0) {
          console.log("✅ API bookings:", res.data.data);
          setBookings(res.data.data || []);
        } else {
          console.warn("⚠️ API trả về errCode khác 0:", res.data);
        }
      } catch (e) {
        console.error("❌ Lỗi lấy dữ liệu lịch sử đặt vé:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

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
      title: "Loại xe",
      key: "type",
      render: (_: any, record: any) => record.trip?.vehicle?.type || "—",
    },
    {
      title: "Biển số xe",
      key: "licensePlate",
      render: (_: any, record: any) =>
        record.trip?.vehicle?.licensePlate || "—",
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
      title: "Ghế (Tầng)",
      key: "seatInfo",
      render: (_: any, record: any) => {
        const seats = record.seats || [];
        if (seats.length === 0) return "—";
        return seats
          .map((s: any) => `${s.seat?.name} (${s.seat?.floor || 1})`)
          .join(", ");
      },
    },

    {
      title: "Giá vé",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (p: number) =>
        p
          ? Number(p).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          : "--",
    },
    {
      title: "Trạng thái thanh toán",
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
            ? "ĐANG CHỜ XÁC NHẬN"
            : "THẤT BẠI";
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div className="profile-container">
      <ProfileSidebar
        activeTab="history"
        onChangeTab={(tab) => navigate(`/profile/${tab}`)}
      />
      <div className="main-content">
        <div className="trip-history">
          <h3>Lịch sử chuyến đi</h3>
          <Table
            loading={loading}
            columns={columns}
            dataSource={bookings}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
    </div>
  );
}
