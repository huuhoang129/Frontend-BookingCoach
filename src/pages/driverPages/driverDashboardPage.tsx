//src/pages/driverPages/driverDashboardPage.tsx
import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Statistic,
  List,
  Avatar,
  Spin,
  Collapse,
} from "antd";
import {
  CarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useAuth } from "../../hooks/AuthHooks/useAuth";
import "./driverDashboardPage.scss";

const { Panel } = Collapse;

interface DriverSchedule {
  id: number;
  note?: string;
  trip?: {
    id: number;
    startDate: string;
    startTime: string;
    totalTime: string;
    route?: {
      fromLocation?: { nameLocations: string };
      toLocation?: { nameLocations: string };
    };
    vehicle?: { name: string; licensePlate: string };
    status?: string;
  };
}

export default function DriverDashboardPage() {
  const { currentUser } = useAuth();
  const [schedules, setSchedules] = useState<DriverSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const now = dayjs();
  const today = now.format("YYYY-MM-DD");

  // Lấy danh sách chuyến của tài xế
  const fetchDriverSchedules = async () => {
    try {
      setLoading(true);
      if (!currentUser?.id) return;

      const res = await axios.get(
        `http://localhost:8080/api/v1/driver-schedules?userId=${currentUser.id}`
      );

      if (res.data.errCode === 0) {
        setSchedules(res.data.data || []);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách chuyến của tài xế:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverSchedules();
  }, [currentUser]);

  // Nhóm chuyến xe theo ngày
  const groupedTrips: Record<string, DriverSchedule[]> = {};
  schedules.forEach((s) => {
    const tripDate = s.trip?.startDate;
    if (!tripDate) return;

    const dateKey = dayjs(tripDate).format("YYYY-MM-DD");
    if (!groupedTrips[dateKey]) groupedTrips[dateKey] = [];
    groupedTrips[dateKey].push(s);
  });

  // Tách ngày
  const futureDates: string[] = [];
  const todayDates: string[] = [];
  const pastDates: string[] = [];

  Object.keys(groupedTrips).forEach((date) => {
    if (dayjs(date).isAfter(today)) futureDates.push(date);
    else if (date === today) todayDates.push(date);
    else pastDates.push(date);
  });

  // Sắp xếp thứ tự hiển thị
  futureDates.sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf());
  pastDates.sort((a, b) => dayjs(b).valueOf() - dayjs(a).valueOf());

  const sortedDates = [...futureDates, ...todayDates, ...pastDates];

  // Thống kê nhanh hôm nay
  const todayTrips = groupedTrips[today] || [];
  const assignedVehicle =
    todayTrips.length > 0 ? todayTrips[0].trip?.vehicle?.licensePlate : "—";

  const overallStatus =
    todayTrips.length === 0
      ? "Không có chuyến hôm nay"
      : todayTrips.some((t) => t.trip?.status === "RUNNING")
      ? "Đang chạy"
      : todayTrips.some((t) => t.trip?.status === "READY")
      ? "Sẵn sàng"
      : "Chờ khởi hành";

  // Giao diện
  return (
    <div className="driver-dashboard">
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Thống kê nhanh */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Số chuyến hôm nay"
                  value={todayTrips.length}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Xe được phân công hôm nay"
                  value={assignedVehicle || "—"}
                  prefix={<CarOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Trạng thái hoạt động"
                  value={overallStatus}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{
                    color:
                      overallStatus === "Đang chạy"
                        ? "#faad14"
                        : overallStatus === "Sẵn sàng"
                        ? "#52c41a"
                        : overallStatus === "Chờ khởi hành"
                        ? "#1890ff"
                        : "#999",
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* Danh sách chuyến theo ngày */}
          <div style={{ marginTop: 24 }}>
            {sortedDates.length === 0 ? (
              <Card>
                <p style={{ textAlign: "center", color: "#888" }}>
                  Chưa có chuyến nào được phân công.
                </p>
              </Card>
            ) : (
              <Collapse bordered={false} defaultActiveKey={todayDates}>
                {sortedDates.map((date) => {
                  const trips = groupedTrips[date];
                  const dateObj = dayjs(date);

                  const label =
                    date === today
                      ? "Chuyến xe hôm nay"
                      : dateObj.isAfter(today)
                      ? `Chuyến ngày ${dateObj.format("DD/MM/YYYY")}`
                      : `Chuyến ngày ${dateObj.format("DD/MM/YYYY")}`;

                  return (
                    <Panel
                      key={date}
                      header={label}
                      style={{
                        backgroundColor:
                          date === today
                            ? "#f6ffed"
                            : dateObj.isAfter(today)
                            ? "#fffbe6"
                            : "#fafafa",
                        borderRadius: 8,
                      }}
                    >
                      <List
                        itemLayout="horizontal"
                        dataSource={trips}
                        renderItem={(s) => {
                          const route = `${
                            s.trip?.route?.fromLocation?.nameLocations || "?"
                          } → ${
                            s.trip?.route?.toLocation?.nameLocations || "?"
                          }`;

                          // Tính thời gian kết thúc theo totalTime
                          const startDateTime = dayjs(
                            `${s.trip?.startDate} ${s.trip?.startTime}`
                          );
                          const [h, m, sec] = s.trip?.totalTime
                            ?.split(":")
                            .map(Number) || [0, 0, 0];

                          const endDateTime = startDateTime
                            .add(h, "hour")
                            .add(m, "minute")
                            .add(sec, "second");

                          // Xác định trạng thái
                          let status = s.trip?.status || "Chờ khởi hành";

                          if (endDateTime.isBefore(now))
                            status = "Đã hoàn thành";
                          else if (
                            startDateTime.isBefore(now) &&
                            endDateTime.isAfter(now)
                          )
                            status = "Đang chạy";
                          else if (startDateTime.isAfter(now))
                            status = "Chờ khởi hành";

                          return (
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  <Avatar icon={<ClockCircleOutlined />} />
                                }
                                title={<b>{route}</b>}
                                description={
                                  <>
                                    <div>
                                      Giờ khởi hành:{" "}
                                      {s.trip?.startTime || "--:--"}
                                    </div>
                                    <div>
                                      Giờ dự kiến đến:{" "}
                                      {endDateTime.format("HH:mm")}
                                    </div>
                                    <div>
                                      Xe:{" "}
                                      {s.trip?.vehicle?.licensePlate ||
                                        s.trip?.vehicle?.name ||
                                        "—"}
                                    </div>
                                  </>
                                }
                              />
                              <Tag
                                color={
                                  status === "Đang chạy"
                                    ? "green"
                                    : status === "Sẵn sàng"
                                    ? "blue"
                                    : status === "Đã hoàn thành"
                                    ? "gray"
                                    : "default"
                                }
                              >
                                {status}
                              </Tag>
                            </List.Item>
                          );
                        }}
                      />
                    </Panel>
                  );
                })}
              </Collapse>
            )}
          </div>
        </>
      )}
    </div>
  );
}
