// Fake service cho báo cáo doanh thu (mock data)
// Trả về object giống backend: { errCode, data, errMessage }

export type GroupBy = "day" | "month" | "year";

export interface Revenue {
  date: string;
  totalRevenue: number;
}

const PRICE_LEVELS = [200_000, 250_000, 300_000];
const rangeDays = (fromISO: string, toISO: string) => {
  const out: string[] = [];
  const start = new Date(fromISO + "T00:00:00");
  const end = new Date(toISO + "T00:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
};

// Format key theo groupBy
const toGroupKey = (iso: string, groupBy: GroupBy) => {
  if (groupBy === "day") return iso;
  if (groupBy === "month") return iso.slice(0, 7) + "-01";
  return iso.slice(0, 4) + "-01-01";
};

// Doanh thu giả lập: giá vé * số vé
const synthRevenue = (idx: number) => {
  const price = PRICE_LEVELS[idx % PRICE_LEVELS.length];
  const ticketsSold = 5 + Math.floor(Math.random() * 16);
  return price * ticketsSold;
};

const groupByMap = (
  items: { date: string; value: number }[],
  groupBy: GroupBy
): Revenue[] => {
  if (groupBy === "day") {
    return items.map((i) => ({ date: i.date, totalRevenue: i.value }));
  }
  const map = new Map<string, number>();
  for (const it of items) {
    const key = toGroupKey(it.date, groupBy);
    map.set(key, (map.get(key) || 0) + it.value);
  }
  return Array.from(map.entries())
    .map(([date, totalRevenue]) => ({ date, totalRevenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// Fake holiday
const isHoliday = (iso: string) => {
  const m = iso.slice(5, 10);
  return m === "01-01" || m === "04-30" || m === "05-01" || m === "09-02";
};

// API fake
export const getRevenue = async (
  from: string,
  to: string,
  groupBy: GroupBy
) => {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await delay(300 + Math.random() * 300);

  try {
    const days = rangeDays(from, to);
    const dayValues = days.map((iso, idx) => {
      let value = synthRevenue(idx);
      if (isHoliday(iso)) value = Math.round(value * 1.5);
      return { date: iso, value };
    });

    const grouped: Revenue[] = groupByMap(dayValues, groupBy);

    return {
      data: {
        errCode: 0,
        data: grouped,
        errMessage: "",
      },
    };
  } catch (e) {
    return {
      data: {
        errCode: 1,
        data: [],
        errMessage: "Fake service error",
      },
    };
  }
};

export default { getRevenue };
