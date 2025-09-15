import { Form, Image } from "antd";

// Props
interface FormImagePreviewProps {
  label?: string;
  name?: string;
  src?: string;
  rules?: any[];
  width?: number;
  height?: number;
}

// Component: FormImagePreview
export function FormImagePreview({
  label = "Xem ảnh",
  name = "image",
  src,
  rules = [],
  width = 200,
  height,
}: FormImagePreviewProps) {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      {src ? (
        <Image
          src={src}
          alt="preview"
          width={width}
          height={height}
          style={{ borderRadius: 8, objectFit: "contain" }}
        />
      ) : (
        <span>Chưa có ảnh</span>
      )}
    </Form.Item>
  );
}
