// Fake service cho báo cáo vé bán
// Trả về object giống backend: { errCode, data, errMessage }

import dayjs from "dayjs";

export interface Sales {
  date: string;
  ticketsSold: number;
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

// Fake holiday (ngày lễ thì bán nhiều vé hơn)
const isHoliday = (iso: string) => {
  const m = iso.slice(5, 10);
  return m === "01-01" || m === "04-30" || m === "05-01" || m === "09-02";
};

// Hàm giả lập số vé bán trong ngày
const synthTickets = (idx: number) => {
  // base: 20–80 vé/ngày
  const base = 20 + Math.floor(Math.random() * 61);
  // xu hướng tăng dần
  const trend = base + Math.floor(idx / 5);
  return trend;
};

export const getTicketSales = async (from: string, to: string) => {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await delay(200 + Math.random() * 300);

  try {
    const days = rangeDays(from, to);
    const data: Sales[] = days.map((iso, idx) => {
      let sold = synthTickets(idx);
      if (isHoliday(iso)) sold = Math.round(sold * 1.5); // lễ tăng 50%
      return {
        date: iso,
        ticketsSold: sold,
      };
    });

    return {
      data: {
        errCode: 0,
        data,
        errMessage: "",
      },
    };
  } catch (e) {
    return {
      data: {
        errCode: 1,
        data: [],
        errMessage: "Fake ticket sales error",
      },
    };
  }
};

export default { getTicketSales };
