import React from "react";
import { Form } from "antd";
import { Markdown } from "../Markdown/markDown";

interface FormMarkdownProps {
  name?: string; // field name cho nội dung markdown
  label?: string; // label cho markdown
  titleName?: string; // field name cho title
  titleLabel?: string; // label cho title
}

export const FormMarkdown: React.FC<FormMarkdownProps> = ({
  name = "content",
  label = "Nội dung",
}) => {
  return (
    <>
      {/* Editor cho Markdown */}
      <Form.Item
        label={label}
        name={name}
        rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
      >
        <Markdown />
      </Form.Item>
    </>
  );
};
