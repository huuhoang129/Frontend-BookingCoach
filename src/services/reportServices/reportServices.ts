// src/services/reportServices/reportServices.ts
import requestAPI from "../../api/requestAPI";

const API_URL = "/reports";

// Lấy báo cáo doanh thu
const getRevenue = (from: string, to: string, groupBy: string) => {
  return requestAPI.get(`${API_URL}/revenue`, {
    params: { from, to, groupBy },
  });
};

// Lấy báo cáo bán vé
const getTicketSales = (from: string, to: string, groupBy?: string) => {
  return requestAPI.get(`${API_URL}/ticket-sales`, {
    params: { from, to, groupBy },
  });
};

// Lấy báo cáo tỷ lệ hủy vé
const getCancellationRate = (from: string, to: string, groupBy: string) => {
  return requestAPI.get(`${API_URL}/cancellation-rate`, {
    params: { from, to, groupBy },
  });
};

export { getRevenue, getTicketSales, getCancellationRate };
