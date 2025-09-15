import { Form, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface FormImageUploadProps {
  label?: string;
  name?: string;
  rules?: any[];
  buttonText?: string;
  listType?: "text" | "picture" | "picture-card";
  multiple?: boolean;
}

export function FormImageUpload({
  label = "Tải ảnh lên",
  name = "image",
  rules = [{ required: true, message: "Vui lòng tải ảnh lên" }],
  buttonText = "Chọn ảnh",
  listType = "picture",
  multiple = false,
}: FormImageUploadProps) {
  return (
    <Form.Item
      label={label}
      name={name}
      valuePropName="fileList"
      getValueFromEvent={(e) => {
        if (Array.isArray(e)) return e; // trường hợp dragger
        return e && Array.isArray(e.fileList) ? e.fileList : [];
      }}
      rules={rules}
    >
      <Upload
        name={name}
        listType={listType}
        beforeUpload={() => false} // chặn upload tự động, chỉ lưu local
        multiple={multiple}
        maxCount={multiple ? undefined : 1}
      >
        <Button icon={<UploadOutlined />}>{buttonText}</Button>
      </Upload>
    </Form.Item>
  );
}
