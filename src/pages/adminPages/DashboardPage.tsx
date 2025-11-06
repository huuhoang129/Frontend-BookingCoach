import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row, Typography, Table, Tag, message, Spin } from "antd";
import {
  DollarOutlined,
  TeamOutlined,
  CarOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const { Title } = Typography;

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(v)) + " đ";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [topRoutes, setTopRoutes] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ov, ch, tr] = await Promise.all([
        axios.get("http://localhost:8080/api/v1/overview"),
        axios.get("http://localhost:8080/api/v1/charts"),
        axios.get("http://localhost:8080/api/v1/top-routes"),
      ]);

      setOverview(ov.data.data);
      setCharts(ch.data.data);
      setTopRoutes(tr.data.data);
    } catch (e) {
      console.error(e);
      message.error("Không thể tải dữ liệu Dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );

  const statsData = [
    {
      title: "Tổng doanh thu (VNĐ)",
      value: fmtMoney(overview?.totalRevenue || 0),
      icon: <DollarOutlined style={{ color: "#4d940e", fontSize: 20 }} />,
      color: "#4d940e",
    },
    {
      title: "Tổng số chuyến xe",
      value: overview?.totalTrips || 0,
      icon: <CarOutlined style={{ color: "#1890ff", fontSize: 20 }} />,
      color: "#1890ff",
    },
    {
      title: "Số vé đã bán",
      value: overview?.totalTickets || 0,
      icon: <BarChartOutlined style={{ color: "#722ed1", fontSize: 20 }} />,
      color: "#722ed1",
    },
    {
      title: "Tài xế đang hoạt động",
      value: overview?.activeDrivers || 0,
      icon: <TeamOutlined style={{ color: "#fa8c16", fontSize: 20 }} />,
      color: "#fa8c16",
    },
  ];

  const revenueChart = charts?.revenueChart || [];
  const bookingRatio = charts?.bookingRatio || [];

  const typeIcons: Record<string, string> = {
    Normal: "🚍",
    Sleeper: "🚌",
    DoubleSleeper: "🛏️",
    Limousine: "🚐",
  };

  const columns = [
    {
      title: "Tuyến xe",
      key: "route",
      render: (_: any, record: any) => (
        <span style={{ fontWeight: 600 }}>
          {record.fromLocationName} → {record.toLocationName}
        </span>
      ),
    },
    {
      title: "Loại xe",
      dataIndex: "vehicleType",
      key: "vehicleType",
      render: (v: string) => (
        <span>
          {typeIcons[v] || "🚗"} {v}
        </span>
      ),
    },
    {
      title: "Vé bán ra",
      dataIndex: "sold",
      key: "sold",
      render: (v: number) => (
        <Tag color="#4d940e" style={{ fontWeight: 600 }}>
          {v}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f7fa", minHeight: "100vh" }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        📊 Dashboard - Tổng quan hệ thống
      </Title>

      {/* KPI Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {statsData.map((item, idx) => (
          <Col xs={24} sm={12} md={6} key={idx}>
            <Card
              style={{
                borderRadius: 10,
                background: "#ffffffff",
                boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                {item.icon}
                <span style={{ fontWeight: 600 }}>{item.title}</span>
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: item.color,
                }}
              >
                {item.value}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} md={16}>
          <Card
            title="📈 Biểu đồ doanh thu tháng"
            style={{
              borderRadius: 10,
              background: "#fff",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueChart}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4d940e" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#4d940e" stopOpacity={0.3} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(v: number) => fmtMoney(v)}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  radius={[8, 8, 0, 0]}
                  barSize={30}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title="🥧 Tỷ lệ đặt vé"
            style={{
              borderRadius: 10,
              background: "#fff",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={bookingRatio}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {bookingRatio.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#4d940e"
                          : index === 1
                          ? "#f5222d"
                          : "#faad14"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top Routes Table */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title="🚍 Top tuyến xe được đặt nhiều nhất"
            style={{
              borderRadius: 10,
              background: "#fff",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <Table
              rowKey="routeId"
              dataSource={topRoutes}
              columns={columns}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
