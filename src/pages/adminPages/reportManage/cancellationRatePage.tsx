import {
  Card,
  Typography,
  Spin,
  Row,
  Col,
  DatePicker,
  Button,
  Table,
  Space,
  Select,
  Tag,
} from "antd";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  ReloadOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  AreaChartOutlined,
  FundOutlined,
} from "@ant-design/icons";
import type { PieLabelRenderProps } from "recharts";
import { useCancellationRate } from "../../../hooks/reportHooks/useCancellationRate.ts";
import type { HistoryItem } from "../../../hooks/reportHooks/useCancellationRate.ts";
import "./noFocus.scss";

const {} = Typography;
const { RangePicker } = DatePicker;

const COLORS = ["#ff4d4f", "#52c41a"];

export default function CancellationRatePage() {
  const {
    data,
    loading,
    range,
    setRange,
    groupBy,
    setGroupBy,
    fetchData,
    setPreset,
  } = useCancellationRate();

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
      {/* Bộ lọc */}
      <Card
        style={{
          marginBottom: 16,
          borderRadius: 10,
          background: "#fafafa",
        }}
        bodyStyle={{ padding: 16 }}
      >
        <Space
          wrap
          size="middle"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          {/* Bộ chọn thời gian */}
          <Space>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CalendarOutlined style={{ color: "#4d940e" }} />
              <b>Khoảng thời gian:</b>
            </span>
            <RangePicker
              value={range || undefined}
              allowClear={false}
              onChange={(val) => setRange(val as [any, any] | null)}
            />
          </Space>

          {/* Nhóm theo */}
          <Space>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <BarChartOutlined style={{ color: "#722ed1" }} />
              <b>Nhóm theo:</b>
            </span>
            <Select
              style={{ width: 160 }}
              value={groupBy}
              onChange={(g) => setGroupBy(g)}
              options={[
                { value: "day", label: "Ngày" },
                { value: "month", label: "Tháng" },
                { value: "year", label: "Năm" },
              ]}
            />
          </Space>

          {/* Preset buttons */}
          <Space>
            <Button onClick={() => setPreset("7d")} icon={<CalendarOutlined />}>
              7 ngày
            </Button>
            <Button
              onClick={() => setPreset("30d")}
              icon={<CalendarOutlined />}
              type="dashed"
            >
              30 ngày
            </Button>
            <Button
              onClick={() => setPreset("ytd")}
              icon={<AreaChartOutlined />}
              style={{ borderColor: "#4d940e", color: "#4d940e" }}
            >
              YTD
            </Button>
            <Button
              onClick={() => setPreset("thisYear")}
              icon={<FundOutlined />}
              style={{ borderColor: "#fa8c16", color: "#fa8c16" }}
            >
              Năm nay
            </Button>
          </Space>

          {/* Action buttons */}
          <Space>
            <Button onClick={fetchData} icon={<ReloadOutlined />}>
              Tải lại
            </Button>
          </Space>
        </Space>
      </Card>

      {/* KPIs */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <CalendarOutlined style={{ color: "#1890ff" }} />
              <span style={{ fontWeight: 500 }}>Tổng booking</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#1890ff" }}>
              {data?.totalBookings ?? 0}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <FallOutlined style={{ color: "#ff4d4f" }} />
              <span style={{ fontWeight: 500 }}>Booking bị hủy</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#ff4d4f" }}>
              {data?.cancelledBookings ?? 0}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              {(data?.cancellationRate || 0) > 20 ? (
                <FallOutlined style={{ color: "#ff4d4f" }} />
              ) : (
                <RiseOutlined style={{ color: "#4d940e" }} />
              )}
              <span style={{ fontWeight: 500 }}>Tỷ lệ hủy</span>
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                color:
                  (data?.cancellationRate || 0) > 20 ? "#ff4d4f" : "#4d940e",
              }}
            >
              {Number(data?.cancellationRate || 0).toFixed(2)}%
            </div>
          </Card>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Phân bố Hủy / Không hủy">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={60}
                    isAnimationActive={false}
                    label={(props: PieLabelRenderProps) => {
                      const { name, percent } = props;
                      const p = Number(percent ?? 0) * 100;
                      return `${name ?? ""}: ${p.toFixed(1)}%`;
                    }}
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Xu hướng hủy theo thời gian">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data?.history || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cancelled"
                    stroke="#ff4d4f"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={false}
                    isAnimationActive={false}
                    name="Bị hủy"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#4d940e"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={false}
                    isAnimationActive={false}
                    name="Tổng booking"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Card title="Chi tiết số liệu" style={{ marginTop: 20 }}>
          <Table
            dataSource={data?.history || []}
            rowKey="date"
            columns={[
              { title: "Ngày", dataIndex: "date" },
              { title: "Tổng booking", dataIndex: "total" },
              { title: "Bị hủy", dataIndex: "cancelled" },
              {
                title: "Tỷ lệ hủy (%)",
                render: (row: HistoryItem) => {
                  const rate = row.total
                    ? (row.cancelled / row.total) * 100
                    : 0;
                  return (
                    <Tag color={rate > 20 ? "red" : "green"}>
                      {rate.toFixed(2)}%
                    </Tag>
                  );
                },
              },
            ]}
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
        </Card>
      </Spin>
    </div>
  );
}
