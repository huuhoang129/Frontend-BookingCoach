import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";

// Props
interface CustomCheckboxProps extends CheckboxProps {
  label?: string;
}

// Component: CustomCheckbox
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
