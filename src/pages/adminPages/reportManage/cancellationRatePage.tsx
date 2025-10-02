// CancellationRatePage.tsx
import { useEffect, useState } from "react";
import { Card, Typography, Spin, Statistic, Row, Col } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const { Title } = Typography;

const COLORS = ["#ff4d4f", "#52c41a"];

interface Rate {
  totalBookings: number;
  cancelledBookings: number;
  cancellationRate: number;
}

export default function CancellationRatePage() {
  const [data, setData] = useState<Rate | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/reports/cancellation-rate"
      );
      if (res.data.errCode === 0) setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = data
    ? [
        { name: "Bị hủy", value: data.cancelledBookings },
        {
          name: "Không hủy",
          value: data.totalBookings - data.cancelledBookings,
        },
      ]
    : [];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>❌ Tỷ lệ hủy vé</Title>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số booking"
              value={data?.totalBookings || 0}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Booking bị hủy"
              value={data?.cancelledBookings || 0}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tỷ lệ hủy (%)"
              value={data?.cancellationRate || 0}
              precision={2}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {loading ? (
          <Spin />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}
