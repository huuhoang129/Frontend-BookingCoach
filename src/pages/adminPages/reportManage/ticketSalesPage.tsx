import { useState } from "react";
import {
  Card,
  Table,
  Typography,
  Spin,
  DatePicker,
  Space,
  Button,
  Row,
  Col,
  Empty,
  Tag,
  Switch,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  LineChart,
  Line,
} from "recharts";
import {
  ReloadOutlined,
  FileExcelOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  ColumnHeightOutlined,
  LineChartOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useTicketSales } from "../../../hooks/reportHooks/useTicketSales.ts";
import type { RowView } from "../../../hooks/reportHooks/useTicketSales.ts";

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function TicketSalesPage() {
  const {
    data,
    loading,
    range,
    setRange,
    fetchData,
    totalTickets,
    avgTickets,
    maxItem,
    tableRows,
    handleExportCSV,
    setPreset,
  } = useTicketSales();

  const [showAverage, setShowAverage] = useState(true);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  return (
    <div style={{ padding: 24, background: "#f5f7fa", minHeight: "100vh" }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        🎟️ Báo cáo vé bán ra
      </Title>

      {/* Filter */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
        <Space wrap size="middle">
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CalendarOutlined style={{ color: "#4d940e" }} />
            <b>Khoảng thời gian:</b>
          </span>
          <RangePicker
            value={range}
            allowClear={false}
            onChange={(val) => {
              if (val && val[0] && val[1]) setRange([val[0], val[1]]);
            }}
          />
          <Button onClick={() => setPreset("7d")}>7 ngày</Button>
          <Button onClick={() => setPreset("30d")}>30 ngày</Button>
          <Button onClick={() => setPreset("ytd")}>YTD</Button>
          <Button onClick={fetchData} icon={<ReloadOutlined />}>
            Tải lại
          </Button>
          <Button
            type="primary"
            onClick={handleExportCSV}
            icon={<FileExcelOutlined />}
            style={{ backgroundColor: "#4d940e", borderColor: "#4d940e" }}
          >
            Xuất CSV
          </Button>

          {/* Switch chart */}
          <Switch
            checkedChildren={<ColumnHeightOutlined />}
            unCheckedChildren={<LineChartOutlined />}
            checked={chartType === "bar"}
            onChange={(checked) => setChartType(checked ? "bar" : "line")}
          />
          <Switch
            checked={showAverage}
            onChange={setShowAverage}
            checkedChildren="TB On"
            unCheckedChildren="TB Off"
          />
        </Space>
      </Card>

      {/* KPI */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {/* Tổng vé bán */}
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
              <BarChartOutlined style={{ color: "#4d940e" }} />
              <span style={{ fontWeight: 500 }}>Tổng vé bán</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#4d940e" }}>
              {totalTickets}
            </div>
          </Card>
        </Col>

        {/* Trung bình/ngày */}
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
              <LineChartOutlined style={{ color: "#1890ff" }} />
              <span style={{ fontWeight: 500 }}>Trung bình/ngày</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#1890ff" }}>
              {avgTickets.toFixed(1)}
            </div>
          </Card>
        </Col>

        {/* Ngày cao nhất */}
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
              <RiseOutlined style={{ color: "#fa8c16" }} />
              <span style={{ fontWeight: 500 }}>Ngày cao nhất</span>
            </div>
            {maxItem ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                <span style={{ color: "#fa8c16" }}>{maxItem.ticketsSold}</span>
                <span style={{ fontSize: 13, color: "#888", fontWeight: 400 }}>
                  ({maxItem.date})
                </span>
              </div>
            ) : (
              <div style={{ fontSize: 24, fontWeight: 600 }}>—</div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Chart */}
      <Card style={{ marginBottom: 20 }}>
        {loading ? (
          <Spin />
        ) : data.length === 0 ? (
          <Empty description="Không có dữ liệu" />
        ) : chartType === "bar" ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(val: number) => [`${val} vé`, "Số vé"]} />
              {showAverage && (
                <ReferenceLine
                  y={avgTickets}
                  stroke="#999"
                  strokeDasharray="4 4"
                  label="Trung bình"
                />
              )}
              <Bar dataKey="ticketsSold" fill="#4d940e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(val: number) => [`${val} vé`, "Số vé"]} />
              {showAverage && (
                <ReferenceLine
                  y={avgTickets}
                  stroke="#999"
                  strokeDasharray="4 4"
                  label="Trung bình"
                />
              )}
              <Line
                type="monotone"
                dataKey="ticketsSold"
                stroke="#4d940e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Table */}
      <Card>
        <Table<RowView>
          rowKey="key"
          dataSource={tableRows}
          pagination={{ pageSize: 12 }}
          columns={[
            { title: "Ngày", dataIndex: "date" },
            {
              title: "Số vé bán ra",
              dataIndex: "ticketsSold",
              sorter: (a, b) => a.ticketsSold - b.ticketsSold,
            },
            {
              title: "Tăng/giảm",
              dataIndex: "delta",
              render: (v) =>
                v === null ? (
                  "—"
                ) : v >= 0 ? (
                  <Tag color="green">
                    <RiseOutlined /> +{v}
                  </Tag>
                ) : (
                  <Tag color="red">
                    <FallOutlined /> -{Math.abs(v)}
                  </Tag>
                ),
            },
            {
              title: "Tăng/giảm (%)",
              dataIndex: "deltaPct",
              render: (v) =>
                v === null ? (
                  "—"
                ) : v >= 0 ? (
                  <Tag color="green">+{v.toFixed(2)}%</Tag>
                ) : (
                  <Tag color="red">-{Math.abs(v).toFixed(2)}%</Tag>
                ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
