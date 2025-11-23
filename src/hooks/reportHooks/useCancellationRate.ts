// src/hooks/reportHooks/useCancellationRate.ts
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { getCancellationRate } from "../../services/reportServices/reportServices";

export interface HistoryItem {
  date: string;
  cancelled: number;
  total: number;
}

export interface Rate {
  totalBookings: number;
  cancelledBookings: number;
  cancellationRate: number;
  history?: HistoryItem[];
}

export function useCancellationRate() {
  // Kết quả báo cáo
  const [data, setData] = useState<Rate | null>(null);

  // Trạng thái loading
  const [loading, setLoading] = useState(false);

  // Khoảng thời gian lọc báo cáo
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>([
    dayjs().subtract(6, "day"),
    dayjs(),
  ]);

  // Nhóm dữ liệu theo ngày/tháng/năm
  const [groupBy, setGroupBy] = useState<"day" | "month" | "year">("day");

  // Gọi API lấy tỷ lệ hủy theo range + groupBy
  const fetchData = async () => {
    if (!range) return;
    setLoading(true);

    try {
      const res = await getCancellationRate(
        range[0].format("YYYY-MM-DD"),
        range[1].format("YYYY-MM-DD"),
        groupBy
      );

      if (res.data.errCode === 0) {
        setData(res.data.data);
      } else {
        setData(null);
      }
    } catch (e) {
      console.error("Lỗi khi lấy dữ liệu:", e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Các lựa chọn preset thời gian nhanh
  const setPreset = (type: string) => {
    if (type === "7d") {
      setRange([dayjs().subtract(6, "day"), dayjs()]);
    } else if (type === "30d") {
      setRange([dayjs().subtract(29, "day"), dayjs()]);
    } else if (type === "ytd") {
      setRange([dayjs().startOf("year"), dayjs()]);
    } else if (type === "thisYear") {
      setRange([dayjs().startOf("year"), dayjs().endOf("year")]);
    }
  };

  // Xuất lịch sử tỷ lệ hủy ra file CSV
  const handleExportCSV = () => {
    if (!data?.history) return;

    const rows = [
      ["Ngày", "Tổng booking", "Bị hủy", "Tỷ lệ hủy (%)"],
      ...data.history.map((h) => [
        h.date,
        h.total,
        h.cancelled,
        h.total ? ((h.cancelled / h.total) * 100).toFixed(2) : "0.00",
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "ty-le-huy.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tự động gọi API khi thay đổi range hoặc groupBy
  useEffect(() => {
    fetchData();
  }, [range, groupBy]);

  return {
    data,
    loading,
    range,
    setRange,
    groupBy,
    setGroupBy,
    fetchData,
    setPreset,
    handleExportCSV,
  };
}
