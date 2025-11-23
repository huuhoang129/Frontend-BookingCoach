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
  Select,
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
  AreaChartOutlined,
  FundOutlined,
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
    groupBy,
    setGroupBy,
    chartMA,
    setChartMA,
  } = useTicketSales();

  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  return (
    <div style={{ padding: 24, background: "#f5f7fa", minHeight: "100vh" }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        🎟️ Báo cáo vé bán ra
      </Title>

      {/* Bộ lọc */}
      <Card
        style={{ marginBottom: 16, borderRadius: 10, background: "#fafafa" }}
        bodyStyle={{ padding: 16 }}
      >
        <Space
          wrap
          size="middle"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          {/* Chọn thời gian */}
          <Space>
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
            <Button onClick={() => setPreset("30d")} type="dashed">
              30 ngày
            </Button>
            <Button
              onClick={() => setPreset("ytd")}
              icon={<AreaChartOutlined />}
              style={{ borderColor: "#52c41a", color: "#52c41a" }}
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
            <Switch
              checkedChildren={<ColumnHeightOutlined />}
              unCheckedChildren={<LineChartOutlined />}
              checked={chartType === "bar"}
              onChange={(checked) => setChartType(checked ? "bar" : "line")}
            />
            {groupBy === "day" && (
              <Button
                type={chartMA ? "primary" : "default"}
                onClick={() => setChartMA((s) => !s)}
                style={
                  chartMA
                    ? { backgroundColor: "#4d940e", borderColor: "#4d940e" }
                    : {}
                }
              >
                {chartMA ? "Tắt MA7" : "Bật MA7"}
              </Button>
            )}
            <Button onClick={fetchData} icon={<ReloadOutlined />}>
              Tải lại
            </Button>
          </Space>
        </Space>
      </Card>

      {/* KPIs */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <BarChartOutlined style={{ color: "#4d940e" }} />
              <span style={{ fontWeight: 500 }}>Tổng vé bán</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#4d940e" }}>
              {totalTickets}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CalendarOutlined style={{ color: "#722ed1" }} />
              <span style={{ fontWeight: 500 }}>
                {groupBy === "day"
                  ? "Số ngày"
                  : groupBy === "month"
                  ? "Số tháng"
                  : "Số năm"}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#722ed1" }}>
              {data.length}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <AreaChartOutlined style={{ color: "#1890ff" }} />
              <span style={{ fontWeight: 500 }}>
                Trung bình / {groupBy === "day" ? "ngày" : groupBy}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#1890ff" }}>
              {avgTickets.toFixed(1)}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <RiseOutlined style={{ color: "#fa8c16" }} />
              <span style={{ fontWeight: 500 }}>
                {groupBy === "day" ? "Ngày cao nhất" : "Kỳ cao nhất"}
              </span>
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
              <defs>
                <linearGradient
                  id="ticketsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#4d940e" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#4d940e" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(val: number) => [`${val} vé`, "Số vé"]} />
              <ReferenceLine
                y={avgTickets}
                stroke="#999"
                strokeDasharray="4 4"
                label="Trung bình"
              />
              <Bar
                dataKey="ticketsSold"
                fill="url(#ticketsGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4d940e" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#4d940e" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="maGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1890ff" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1890ff" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(val: number) => [`${val} vé`, "Số vé"]} />
              <ReferenceLine
                y={avgTickets}
                stroke="#999"
                strokeDasharray="4 4"
                label="Trung bình"
              />

              {/* Đường chính */}
              <Line
                type="monotone"
                dataKey="ticketsSold"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />

              {/* Đường MA7 nếu có */}
              {chartMA && (
                <Line
                  type="monotone"
                  dataKey="ma7"
                  stroke="url(#maGradient)"
                  strokeWidth={2}
                  dot={false}
                />
              )}
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
