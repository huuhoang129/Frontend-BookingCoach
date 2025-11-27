// src/pages/adminPages/ticketManage/components/CancellationDetailModal.tsx
import { Modal, Form, Select, Input, Tag } from "antd";
import type { Cancellation } from "../../../types/cancellation";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  selected: Cancellation | null;
  form: any;
}

export default function CancellationDetailModal({
  open,
  onClose,
  onSubmit,
  selected,
  form,
}: Props) {
  if (!selected) return null;

  const methodLabels: Record<string, string> = {
    CASH: "Tiền mặt",
    BANK: "Ngân hàng",
  };

  const methodColors: Record<string, string> = {
    CASH: "blue",
    BANK: "green",
  };

  return (
    <Modal
      title="Chi tiết yêu cầu hủy vé"
      open={open}
      onCancel={onClose}
      onOk={onSubmit}
      okText="Cập nhật"
      cancelText="Đóng"
    >
      {/* Thông tin cơ bản */}
      <p>
        <b>Mã Booking:</b> {selected.bookingCode}
      </p>

      <p>
        <b>Khách hàng:</b> {selected.user?.firstName} {selected.user?.lastName}
      </p>

      <p>
        <b>Lý do:</b> {selected.reason}
      </p>

      <p>
        <b>Phương thức:</b>{" "}
        <Tag color={methodColors[selected.refundMethod]}>
          {methodLabels[selected.refundMethod]}
        </Tag>
      </p>

      {selected.refundMethod === "BANK" && (
        <>
          <p>
            <b>Ngân hàng:</b> {selected.bankName}
          </p>
          <p>
            <b>Số tài khoản:</b> {selected.bankNumber}
          </p>
        </>
      )}

      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item name="status" label="Trạng thái">
          <Select>
            <Option value="WAITING">Chờ duyệt</Option>
            <Option value="APPROVED">Đã duyệt</Option>
            <Option value="REJECTED">Từ chối</Option>
          </Select>
        </Form.Item>

        <Form.Item name="adminNote" label="Ghi chú">
          <Input.TextArea rows={3} placeholder="Nhập ghi chú..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
