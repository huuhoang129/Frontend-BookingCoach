import { Form, Input } from "antd";

// Props
interface FormInputProps {
  label?: string;
  name?: string;
  placeholder?: string;
  rules?: any[];
  value?: string;
  disabled?: boolean;
}

// Component: FormInput
export function FormInput({
  label = "Tiêu đề",
  name = "title",
  placeholder = "Nhập tiêu đề",
  rules = [{ required: true, message: "Vui lòng nhập tiêu đề" }],
  disabled = false,
}: FormInputProps) {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Input placeholder={placeholder} disabled={disabled} />
    </Form.Item>
  );
}
