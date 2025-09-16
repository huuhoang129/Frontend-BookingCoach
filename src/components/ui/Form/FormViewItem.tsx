import { Row, Col, Typography } from "antd";

const { Text } = Typography;

interface FormViewItemProps {
  label: string;
  value?: string | number | null;
  spanLabel?: number; // tỷ lệ label
  spanValue?: number; // tỷ lệ value
}

export function FormViewItem({
  label,
  value,
  spanLabel = 6,
  spanValue = 18,
}: FormViewItemProps) {
  return (
    <Row style={{ marginBottom: 12 }}>
      <Col span={spanLabel}>
        <Text strong>{label}:</Text>
      </Col>
      <Col span={spanValue}>
        <Text>{value || "-"}</Text>
      </Col>
    </Row>
  );
}
