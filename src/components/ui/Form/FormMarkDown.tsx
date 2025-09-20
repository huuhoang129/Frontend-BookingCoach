import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { uploadImage } from "../../../services/systemServices/staticPageServices"; // 👈 import API upload

interface FormMarkDownProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (val: string) => void;
  initialValue?: string;
  height?: number;
  width?: string | number;
  rules?: { required?: boolean; message?: string }[];
  folder?: string;
}

export function FormMarkDown({
  label,
  name,
  value,
  onChange,
  initialValue = "",
  height = 350,
  width = "100%",
  folder = "general",
}: FormMarkDownProps) {
  const [internalValue, setInternalValue] = useState<string>(
    value ?? initialValue
  );

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (val?: string) => {
    const newVal = val || "";
    setInternalValue(newVal);
    if (onChange) onChange(newVal);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadImage(file, folder || "general");
      if (res.data.errCode === 0) {
        const url = res.data.url;
        const markdownImage = `\n\n![${file.name}](${url})`;

        const newValue = (value ?? internalValue) + markdownImage;
        setInternalValue(newValue);
        if (onChange) onChange(newValue);
      } else {
        alert("❌ Upload thất bại: " + res.data.errMessage);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Lỗi upload ảnh");
    } finally {
      e.target.value = ""; // reset input file
    }
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
      <div
        style={{ width, maxWidth: typeof width === "string" ? width : "none" }}
      >
        <MDEditor
          value={internalValue}
          onChange={handleChange}
          height={height}
        />
        <div style={{ marginTop: "8px" }}>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
      </div>
    </div>
  );
}
