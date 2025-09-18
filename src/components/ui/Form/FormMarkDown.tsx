import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

interface FormMarkDownProps {
  label?: string;
  name: string;
  value?: string;
  onChange?: (val: string) => void;
  initialValue?: string;
  height?: number;
  width?: string | number;
  rules?: { required?: boolean; message?: string }[];
}

export function FormMarkDown({
  label = "Nội dung",
  name,
  value,
  onChange,
  initialValue = "",
  height = 350,
  width = "100%",
}: FormMarkDownProps) {
  const [internalValue, setInternalValue] = useState<string>(
    value ?? initialValue
  );

  const handleChange = (val?: string) => {
    setInternalValue(val || "");
    if (onChange) onChange(val || "");
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label
          htmlFor={name}
          style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
        >
          {label}
        </label>
      )}
      <div style={{ width, maxWidth: "800px" }}>
        <MDEditor
          value={value ?? internalValue}
          onChange={handleChange}
          height={height}
        />
      </div>
    </div>
  );
}
