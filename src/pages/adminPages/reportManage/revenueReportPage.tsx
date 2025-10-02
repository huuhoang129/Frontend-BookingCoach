// RevenueReportPage.tsx
import { useEffect, useMemo, useState } from "react";
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
  Statistic,
  Empty,
  message,
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
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;
type GroupBy = "day" | "month" | "year";

interface Revenue {
  date: string;
  totalRevenue: number;
}
interface RowView {
  key: string;
  label: string;
  totalRevenue: number;
  delta: number | null;
  deltaPct: number | null;
  cumulative: number;
}

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(v)) + " đ";

const fmtLabel = (iso: string, groupBy: GroupBy) => {
  const d = dayjs(iso);
  if (groupBy === "day") return d.format("DD/MM/YYYY");
  if (groupBy === "month") return d.format("MM/YYYY");
  return d.format("YYYY");
};

const groupClientSide = (raw: Revenue[], groupBy: GroupBy): Revenue[] => {
  if (groupBy === "day") return raw;
  const map = new Map<string, number>();
  for (const r of raw) {
    const k =
      groupBy === "month"
        ? dayjs(r.date).format("YYYY-MM-01")
        : dayjs(r.date).format("YYYY-01-01");
    map.set(k, (map.get(k) || 0) + Number(r.totalRevenue || 0));
  }
  const out: Revenue[] = Array.from(map.entries())
    .map(([k, sum]) => ({ date: k, totalRevenue: sum }))
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  return out;
};

const movingAverage = (arr: Revenue[], windowSize = 7): number[] => {
  if (arr.length === 0) return [];
  const res: number[] = [];
  let running = 0;
  const w = Math.max(1, windowSize);
  for (let i = 0; i < arr.length; i++) {
    running += Number(arr[i].totalRevenue || 0);
    if (i >= w) running -= Number(arr[i - w].totalRevenue || 0);
    const denom = i + 1 < w ? i + 1 : w;
    res.push(running / denom);
  }
  return res;
};

export default function RevenueReportPage() {
  const [rawData, setRawData] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>("day");
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(29, "day"),
    dayjs(),
  ]);
  const [chartMA, setChartMA] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const from = range[0].format("YYYY-MM-DD");
      const to = range[1].format("YYYY-MM-DD");
      const res = await axios.get(
        `http://localhost:8080/api/v1/reports/revenue`,
        { params: { from, to, groupBy } }
      );
      if (res.data?.errCode === 0) {
        const items: Revenue[] = (res.data.data || []).map((r: any) => ({
          date: r.date,
          totalRevenue: Number(r.totalRevenue || 0),
        }));
        const grouped =
          groupBy === "day" ? items : groupClientSide(items, groupBy);
        setRawData(
          grouped.sort(
            (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
          )
        );
      } else {
        setRawData([]);
        if (res.data?.errMessage) message.warning(res.data.errMessage);
      }
    } catch (e) {
      setRawData([]);
      message.error("Không tải được dữ liệu doanh thu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy, range]);

  const data = useMemo(() => {
    return rawData.map((r) => ({
      ...r,
      label: fmtLabel(r.date, groupBy),
    }));
  }, [rawData, groupBy]);

  const dataWithMA = useMemo(() => {
    if (!chartMA || groupBy !== "day") return data;
    const ma = movingAverage(rawData, 7);
    return data.map((d, idx) => ({
      ...d,
      ma7: ma[idx],
    }));
  }, [data, chartMA, groupBy, rawData]);

  const totalRevenue = useMemo(
    () => data.reduce((acc, cur) => acc + Number(cur.totalRevenue || 0), 0),
    [data]
  );
  const periods = data.length;
  const avgPerPeriod = periods ? totalRevenue / periods : 0;
  const maxItem =
    periods > 0
      ? data.reduce((a, b) => (a.totalRevenue > b.totalRevenue ? a : b))
      : null;

  const tableRows: RowView[] = useMemo(() => {
    let cumul = 0;
    return data.map((d, idx) => {
      const prev = idx > 0 ? data[idx - 1] : null;
      const delta = prev
        ? Number(d.totalRevenue || 0) - Number(prev.totalRevenue || 0)
        : null;
      const deltaPct =
        prev && prev.totalRevenue
          ? (delta! / Number(prev.totalRevenue)) * 100
          : null;
      cumul += Number(d.totalRevenue || 0);
      return {
        key: d.date,
        label: d.label,
        totalRevenue: Number(d.totalRevenue || 0),
        delta,
        deltaPct,
        cumulative: cumul,
      };
    });
  }, [data]);

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

  const setPreset = (type: "7d" | "30d" | "ytd" | "thisYear") => {
    if (type === "7d") {
      setRange([dayjs().subtract(6, "day"), dayjs()]);
      setGroupBy("day");
    } else if (type === "30d") {
      setRange([dayjs().subtract(29, "day"), dayjs()]);
      setGroupBy("day");
    } else if (type === "ytd") {
      setRange([dayjs().startOf("year"), dayjs()]);
      setGroupBy("month");
    } else {
      setRange([dayjs().startOf("year"), dayjs().endOf("year")]);
      setGroupBy("month");
    }
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
            <Select<GroupBy>
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
            <Button
              onClick={() => setPreset("7d")}
              icon={<CalendarOutlined />}
              type="default"
            >
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
            <Button
              onClick={fetchData}
              icon={<ReloadOutlined />}
              type="default"
            >
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
        <Table<RowView>
          rowKey="key"
          dataSource={tableRows}
          columns={columns as any}
          pagination={{ pageSize: 12 }}
        />
      </Card>
    </div>
  );
}
