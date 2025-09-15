import { useEffect, useState } from "react";
import { Modal, Form } from "antd";

// Props
interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (values: any) => void;
  children: React.ReactNode;
  initialValues?: any;
  width?: number | string;
  okText?: string;
  cancelText?: string;
}

// Component: CustomModal
export function CustomModal({
  open,
  title,
  onClose,
  onSubmit,
  children,
  initialValues,
  width = 550,
  okText = "Lưu",
  cancelText = "Hủy",
}: ModalProps) {
  // Local state & form
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Effect: set initial form values
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  // Handlers
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      onSubmit(values);
      setLoading(false);
      form.resetFields();
      onClose();
    } catch (error) {
      console.log("Validation Failed:", error);
      setLoading(false);
    }
  };

  // ------------------------
  // Render
  // ------------------------
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      okText={okText}
      cancelText={cancelText}
      width={width}
    >
      <Form form={form} layout="vertical">
        {children}
      </Form>
    </Modal>
  );
}
