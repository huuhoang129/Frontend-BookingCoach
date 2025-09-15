// FormSelect.tsx
import { Form, Select } from "antd";

interface FormSelectProps {
  label?: string;
  name?: string;
  placeholder?: string;
  rules?: any[];
  options?: { label: string; value: string }[];
  disabled?: boolean;
}

export function FormSelect({
  label = "Tình trạng",
  name = "status",
  placeholder = "Chọn tình trạng",
  rules = [{ required: true, message: "Vui lòng chọn tình trạng" }],
  options = [
    { label: "Hoạt động", value: "active" },
    { label: "Không hoạt động", value: "inactive" },
  ],
  disabled = false,
}: FormSelectProps) {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Select placeholder={placeholder}>
        {options.map((opt) => (
          <Select.Option key={opt.value} value={opt.value} disabled={disabled}>
            {opt.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}
