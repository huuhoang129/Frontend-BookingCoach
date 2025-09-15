import { Form, Select } from "antd";

// Props
interface FormSelectProps {
  label?: string;
  name?: string;
  placeholder?: string;
  rules?: any[];
  options?: { label: string; value: string }[];
  disabled?: boolean;
}

// Component: FormSelect
export function FormSelect({
  label = "Tình Trạng",
  name = "status",
  placeholder = "Chọn Tình Trạng",
  rules = [{ required: true, message: "Vui Lòng Chọn Tình Trạng" }],
  options = [
    { label: "Hoạt Động", value: "active" },
    { label: "Không Hoạt Động", value: "inactive" },
  ],
  disabled = false,
}: FormSelectProps) {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Select placeholder={placeholder} disabled={disabled}>
        {options.map((opt) => (
          <Select.Option key={opt.value} value={opt.value}>
            {opt.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}
