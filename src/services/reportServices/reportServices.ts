import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

const getRevenue = (from: string, to: string, groupBy: string) => {
  return axios.get(`${API_URL}/reports/revenue`, {
    params: { from, to, groupBy },
  });
};

export { getRevenue };
