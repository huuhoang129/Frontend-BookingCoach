// Fake service cho báo cáo tỷ lệ hủy booking
// Trả về object giống backend: { errCode, data, errMessage }

import dayjs from "dayjs";

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

// Tạo mảng ngày liên tiếp [from..to]
const rangeDays = (fromISO: string, toISO: string) => {
  const out: string[] = [];
  const start = new Date(fromISO + "T00:00:00");
  const end = new Date(toISO + "T00:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    out.push(dayjs(d).format("YYYY-MM-DD"));
  }
  return out;
};

// Fake ngày lễ
const isHoliday = (iso: string) => {
  const m = iso.slice(5, 10);
  return m === "01-01" || m === "04-30" || m === "05-01" || m === "09-02";
};

// Sinh ngẫu nhiên số booking trong ngày
const synthBookings = (idx: number) => {
  // base: 30–100 booking/ngày
  const base = 30 + Math.floor(Math.random() * 71);
  const trend = base + Math.floor(idx / 7);
  return trend;
};

export const getCancellationRate = async (from: string, to: string) => {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await delay(200 + Math.random() * 300);

  try {
    const days = rangeDays(from, to);
    const history: HistoryItem[] = [];
    let totalBookings = 0;
    let cancelledBookings = 0;

    days.forEach((iso, idx) => {
      const total = synthBookings(idx);
      // Tỷ lệ hủy 5–20%
      let cancelRate = 0.05 + Math.random() * 0.15;
      if (isHoliday(iso)) cancelRate += 0.1;
      const cancelled = Math.round(total * cancelRate);

      totalBookings += total;
      cancelledBookings += cancelled;
      history.push({ date: iso, total, cancelled });
    });

    const cancellationRate =
      totalBookings === 0 ? 0 : (cancelledBookings / totalBookings) * 100;

    return {
      data: {
        errCode: 0,
        data: {
          totalBookings,
          cancelledBookings,
          cancellationRate: Number(cancellationRate.toFixed(2)),
          history,
        },
        errMessage: "",
      },
    };
  } catch (e) {
    return {
      data: {
        errCode: 1,
        data: {
          totalBookings: 0,
          cancelledBookings: 0,
          cancellationRate: 0,
          history: [],
        },
        errMessage: "Fake cancellation rate error",
      },
    };
  }
};

export default { getCancellationRate };
