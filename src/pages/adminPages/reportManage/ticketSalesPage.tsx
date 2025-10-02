// TicketSalesPage.tsx
import { useEffect, useState } from "react";
import { Card, Table, Typography, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";

const { Title } = Typography;

interface Sales {
  date: string;
  ticketsSold: number;
}

export default function TicketSalesPage() {
  const [data, setData] = useState<Sales[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/reports/ticket-sales"
      );
      if (res.data.errCode === 0) setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>🎟️ Báo cáo vé bán ra</Title>

      <Card style={{ marginBottom: 20 }}>
        {loading ? (
          <Spin />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ticketsSold" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card>
        <Table
          rowKey="date"
          dataSource={data}
          columns={[
            { title: "Ngày", dataIndex: "date" },
            { title: "Số vé bán ra", dataIndex: "ticketsSold" },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  );
}
