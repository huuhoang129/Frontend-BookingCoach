import { useState, useEffect, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { message } from "antd";
// import { getTicketSales } from "../../services/reportServices/reportServices";
import { getTicketSales } from "../../services/reportServices/reportServices.ticketSales.mock";

export interface Sales {
  date: string;
  ticketsSold: number;
}

export interface RowView {
  key: string;
  date: string;
  ticketsSold: number;
  delta: number | null;
  deltaPct: number | null;
}

export function useTicketSales(initialRange?: [Dayjs, Dayjs]) {
  const [data, setData] = useState<Sales[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<[Dayjs, Dayjs]>(
    initialRange || [dayjs().subtract(14, "day"), dayjs()]
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const from = range[0].format("YYYY-MM-DD");
      const to = range[1].format("YYYY-MM-DD");

      const res = await getTicketSales(from, to);

      if (res.data.errCode === 0) {
        setData(
          (res.data.data || []).map((d: any) => ({
            date: d.date,
            ticketsSold: Number(d.ticketsSold || 0),
          }))
        );
      } else {
        setData([]);
        message.warning(res.data.errMessage || "Không có dữ liệu");
      }
    } catch (e) {
      setData([]);
      message.error("Lỗi tải dữ liệu vé");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  // KPI
  const totalTickets = useMemo(
    () => data.reduce((acc, cur) => acc + cur.ticketsSold, 0),
    [data]
  );
  const avgTickets = data.length ? totalTickets / data.length : 0;
  const maxItem =
    data.length > 0
      ? data.reduce((a, b) => (a.ticketsSold > b.ticketsSold ? a : b))
      : null;

  // Table rows
  const tableRows: RowView[] = useMemo(() => {
    return data.map((d, idx) => {
      const prev = idx > 0 ? data[idx - 1] : null;
      const delta = prev ? d.ticketsSold - prev.ticketsSold : null;
      const deltaPct =
        prev && prev.ticketsSold ? (delta! / prev.ticketsSold) * 100 : null;
      return {
        key: d.date,
        date: d.date,
        ticketsSold: d.ticketsSold,
        delta,
        deltaPct,
      };
    });
  }, [data]);

  // CSV export
  const handleExportCSV = () => {
    const headers = ["date", "ticketsSold"];
    const rows = data.map((d) => [d.date, d.ticketsSold]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket_sales_${range[0].format("YYYYMMDD")}_${range[1].format(
      "YYYYMMDD"
    )}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Preset ranges
  const setPreset = (type: "7d" | "30d" | "ytd") => {
    if (type === "7d") {
      setRange([dayjs().subtract(6, "day"), dayjs()]);
    } else if (type === "30d") {
      setRange([dayjs().subtract(29, "day"), dayjs()]);
    } else {
      setRange([dayjs().startOf("year"), dayjs()]);
    }
  };

  return {
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
  };
}
