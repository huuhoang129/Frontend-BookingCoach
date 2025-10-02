import {
  Card,
  Table,
  Typography,
  Spin,
  DatePicker,
  Select,
  Space,
  Button,
  Row,
  Col,
  Empty,
  Tag,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import {
  ReloadOutlined,
  FileExcelOutlined,
  CalendarOutlined,
  BarChartOutlined,
  AreaChartOutlined,
  RiseOutlined,
  FallOutlined,
  FundOutlined,
} from "@ant-design/icons";
import { useRevenueReport } from "../../../hooks/reportHooks/useRevenueReport";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(v)) + " đ";

export default function RevenueReportPage() {
  const {
    loading,
    groupBy,
    setGroupBy,
    range,
    setRange,
    chartMA,
    setChartMA,
    data,
    dataWithMA,
    totalRevenue,
    periods,
    avgPerPeriod,
    maxItem,
    tableRows,
    fetchData,
    setPreset,
  } = useRevenueReport();

  const handleExportCSV = () => {
    const headers = ["label", "totalRevenue"];
    const rows = data.map((d) => [d.label, d.totalRevenue]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const suffix =
      groupBy === "day" ? "ngay" : groupBy === "month" ? "thang" : "nam";
    a.download = `revenue_${suffix}_${range[0].format(
      "YYYYMMDD"
    )}_${range[1].format("YYYYMMDD")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: groupBy === "day" ? "Ngày" : groupBy === "month" ? "Tháng" : "Năm",
      dataIndex: "label",
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      render: (v: number) => <b style={{ color: "#1890ff" }}>{fmtMoney(v)}</b>,
    },
    {
      title: "Tăng/giảm",
      dataIndex: "delta",
      render: (v: number | null) =>
        v === null ? (
          "—"
        ) : v >= 0 ? (
          <Tag color="green">
            <RiseOutlined /> +{fmtMoney(v)}
          </Tag>
        ) : (
          <Tag color="red">
            <FallOutlined /> -{fmtMoney(Math.abs(v))}
          </Tag>
        ),
    },
    {
      title: "Tăng/giảm (%)",
      dataIndex: "deltaPct",
      render: (v: number | null) =>
        v === null ? (
          "—"
        ) : v >= 0 ? (
          <Tag color="green">+{v.toFixed(2)}%</Tag>
        ) : (
          <Tag color="red">-{Math.abs(v).toFixed(2)}%</Tag>
        ),
    },
    {
      title: "Lũy kế",
      dataIndex: "cumulative",
      render: (v: number) => <b>{fmtMoney(v)}</b>,
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f7fa", minHeight: "100vh" }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        <BarChartOutlined style={{ color: "#4d940e", marginRight: 8 }} />
        Báo cáo doanh thu
      </Title>

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
          </Space>
        </Space>
      </Card>

      {/* KPIs */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {/* Tổng doanh thu */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <BarChartOutlined style={{ color: "#1890ff" }} />
              <span style={{ fontWeight: 500 }}>Tổng doanh thu</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#1890ff" }}>
              {fmtMoney(totalRevenue)}
            </div>
          </Card>
        </Col>

        {/* Số ngày / tháng / năm */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
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
              {periods}
            </div>
          </Card>
        </Col>

        {/* Doanh thu TB */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <AreaChartOutlined style={{ color: "#52c41a" }} />
              <span style={{ fontWeight: 500 }}>
                Doanh thu TB /{" "}
                {groupBy === "day"
                  ? "ngày"
                  : groupBy === "month"
                  ? "tháng"
                  : "năm"}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#52c41a" }}>
              {fmtMoney(avgPerPeriod)}
            </div>
          </Card>
        </Col>

        {/* Ngày/Tháng cao nhất */}
        <Col xs={24} sm={12} md={6}>
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
              <span style={{ fontWeight: 500 }}>Ngày/Tháng cao nhất</span>
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
                <span style={{ color: "#fa8c16" }}>
                  {fmtMoney(maxItem.totalRevenue)}
                </span>
                <span style={{ fontSize: 13, color: "#888", fontWeight: 400 }}>
                  ({maxItem.label})
                </span>
              </div>
            ) : (
              <div style={{ fontSize: 24, fontWeight: 600 }}>—</div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Chart */}
      <Card style={{ marginBottom: 16 }}>
        {loading ? (
          <Spin />
        ) : data.length === 0 ? (
          <Empty description="Không có dữ liệu" />
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={dataWithMA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name.toLowerCase().includes("ma")
                    ? [fmtMoney(Number(value)), "MA(7)"]
                    : [fmtMoney(Number(value)), "Doanh thu"]
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#4d940e"
                strokeWidth={2}
                dot={false}
                name="Doanh thu"
              />
              {chartMA && groupBy === "day" && (
                <Line
                  type="monotone"
                  dataKey="ma7"
                  stroke="#52c41a"
                  strokeWidth={2}
                  dot={false}
                  name="MA(7)"
                />
              )}
              <ReferenceLine
                y={avgPerPeriod}
                stroke="#bfbfbf"
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
                label="Trung bình"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Table phân tích */}
      <Card>
        <Table
          rowKey="key"
          dataSource={tableRows}
          columns={columns as any}
          pagination={{ pageSize: 12 }}
        />
      </Card>
    </div>
  );
}
