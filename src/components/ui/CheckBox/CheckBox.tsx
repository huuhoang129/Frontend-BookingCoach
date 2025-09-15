import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";

interface CustomCheckboxProps extends CheckboxProps {
  label?: string;
}

export default function CustomCheckbox({
  label = "Checkbox",
  ...props
}: CustomCheckboxProps) {
  return (
    <div className="custom-checkbox">
      <Checkbox {...props}>{label}</Checkbox>
    </div>
  );
}
