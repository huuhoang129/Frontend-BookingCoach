import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { message } from "antd";
// import { getRevenue } from "../../services/reportServices/reportServices";
import { getRevenue } from "../../services/reportServices/reportServices.allRevenue.mock";
export type GroupBy = "day" | "month" | "year";

export interface Revenue {
  date: string;
  totalRevenue: number;
}

export interface RowView {
  key: string;
  label: string;
  totalRevenue: number;
  delta: number | null;
  deltaPct: number | null;
  cumulative: number;
}

const fmtLabel = (iso: string, groupBy: GroupBy) => {
  const d = dayjs(iso);
  if (groupBy === "day") return d.format("DD/MM/YYYY");
  if (groupBy === "month") return d.format("MM/YYYY");
  return d.format("YYYY");
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

export const useRevenueReport = () => {
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
      const res = await getRevenue(from, to, groupBy);

      if (res.data?.errCode === 0) {
        const items: Revenue[] = (res.data.data || []).map((r: any) => ({
          date: r.date,
          totalRevenue: Number(r.totalRevenue || 0),
        }));
        setRawData(items);
      } else {
        setRawData([]);
        if (res.data?.errMessage) message.warning(res.data.errMessage);
      }
    } catch {
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

  const data = useMemo(
    () =>
      rawData.map((r) => ({
        ...r,
        label: fmtLabel(r.date, groupBy),
      })),
    [rawData, groupBy]
  );

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

  return {
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
  };
};
