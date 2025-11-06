import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

const getRevenue = (from: string, to: string, groupBy: string) => {
  return axios.get(`${API_URL}/revenue`, {
    params: { from, to, groupBy },
  });
};

const getTicketSales = (from: string, to: string, groupBy?: string) => {
  return axios.get(`${API_URL}/ticket-sales`, {
    params: { from, to, groupBy },
  });
};

const getCancellationRate = (
  startDate: string,
  endDate: string,
  groupBy: string
) => {
  return axios.get(`${API_URL}/cancellation-rate`, {
    params: { startDate, endDate, groupBy },
  });
};

export { getRevenue, getTicketSales, getCancellationRate };
