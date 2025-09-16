import { Form, DatePicker } from "antd";
import type { Rule } from "antd/es/form";
import dayjs from "dayjs";

interface FormDatePickerProps {
  label?: string;
  name: string | (string | number)[];
  placeholder?: string;
  rules?: Rule[];
  disabled?: boolean;
  format?: string;
}

/**
 * FormDatePicker (phiên bản gọn)
 * - Tự động convert string date <-> dayjs
 */
export function FormDatePicker({
  label = "Ngày",
  name,
  placeholder = "Chọn ngày",
  rules = [{ required: true, message: "Vui lòng chọn ngày" }],
  disabled = false,
  format = "YYYY-MM-DD",
}: FormDatePickerProps) {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      getValueProps={(value) => ({
        value: value ? dayjs(value) : null, // string -> dayjs
      })}
      getValueFromEvent={(_, dateString) => dateString} // dayjs -> string
    >
      <DatePicker
        format={format}
        placeholder={placeholder}
        disabled={disabled}
        style={{ width: "100%" }}
      />
    </Form.Item>
  );
}
