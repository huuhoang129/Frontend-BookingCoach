// src/containers/ModalsCollect/userModal/DriverModal.tsx
import { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import dayjs from "dayjs";
import type { Driver } from "../../../hooks/userHooks/useDriverManage";

interface DriverModalProps {
  openAdd: boolean;
  setOpenAdd: (v: boolean) => void;
  openEdit: boolean;
  setOpenEdit: (v: boolean) => void;
  openView: boolean;
  setOpenView: (v: boolean) => void;
  formAdd: any;
  formEdit: any;
  handleAdd: () => void;
  handleEdit: () => void;
  editingDriver: Driver | null;
  viewDriver: Driver | null;
}

export default function DriverModal({
  openAdd,
  setOpenAdd,
  openEdit,
  setOpenEdit,
  openView,
  setOpenView,
  formAdd,
  formEdit,
  handleAdd,
  handleEdit,
  editingDriver,
  viewDriver,
}: DriverModalProps) {
  useEffect(() => {
    if (openEdit && editingDriver) {
      formEdit.setFieldsValue(editingDriver);
    }
  }, [openEdit, editingDriver]);

  const handleCancelAdd = () => setOpenAdd(false);
  const handleClickCancelAdd = () => {
    formAdd.resetFields();
    setOpenAdd(false);
  };

  const handleCancelEdit = () => setOpenEdit(false);
  const handleClickCancelEdit = () => setOpenEdit(false);
  const handleCancelView = () => setOpenView(false);

  return (
    <>
      {/* modal thêm mới tài xế */}
      <Modal
        title="Thêm tài xế mới"
        open={openAdd}
        onCancel={handleCancelAdd}
        width={480}
        centered
        footer={[
          <Button key="cancel" onClick={handleClickCancelAdd}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAdd}
            style={{ background: "#4d940e", borderColor: "#4d940e" }}
          >
            Lưu
          </Button>,
        ]}
      >
        <Form form={formAdd} layout="vertical">
          <Form.Item
            name="firstName"
            label="Tên đầu"
            rules={[{ required: true, message: "Vui lòng nhập tên đầu" }]}
          >
            <Input placeholder="Nhập tên đầu..." />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Tên cuối"
            rules={[{ required: true, message: "Vui lòng nhập tên cuối" }]}
          >
            <Input placeholder="Nhập tên cuối..." />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input placeholder="Nhập email..." />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Số điện thoại">
            <Input placeholder="Nhập số điện thoại..." />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Nhập địa chỉ..." />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="citizenId" label="CMND/CCCD">
            <Input placeholder="Nhập số CMND/CCCD..." />
          </Form.Item>
          <Form.Item name="role" initialValue="Driver" hidden>
            <Input value="Driver" />
          </Form.Item>
        </Form>
      </Modal>

      {/* modal chỉnh sửa tài xế */}
      <Modal
        title="Chỉnh sửa tài xế"
        open={openEdit}
        onCancel={handleCancelEdit}
        width={480}
        centered
        footer={[
          <Button key="cancel" onClick={handleClickCancelEdit}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleEdit}
            style={{ background: "#4d940e", borderColor: "#4d940e" }}
          >
            Cập nhật
          </Button>,
        ]}
      >
        <Form form={formEdit} layout="vertical">
          <Form.Item
            name="firstName"
            label="Tên đầu"
            rules={[{ required: true, message: "Vui lòng nhập tên đầu" }]}
          >
            <Input placeholder="Nhập tên đầu..." />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Tên cuối"
            rules={[{ required: true, message: "Vui lòng nhập tên cuối" }]}
          >
            <Input placeholder="Nhập tên cuối..." />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input placeholder="Nhập email..." />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Số điện thoại">
            <Input placeholder="Nhập số điện thoại..." />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Nhập địa chỉ..." />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="citizenId" label="CMND/CCCD">
            <Input placeholder="Nhập số CMND/CCCD..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* modal xem thông tin tài xế */}
      <Modal
        title="Thông tin tài xế"
        open={openView}
        onCancel={handleCancelView}
        width={480}
        centered
        footer={[
          <Button key="close" type="primary" onClick={() => setOpenView(false)}>
            Đóng
          </Button>,
        ]}
      >
        {viewDriver ? (
          <div style={{ lineHeight: "28px", fontSize: 15 }}>
            <p>
              <b>Mã tài xế:</b> {viewDriver.userCode}
            </p>
            <p>
              <b>Họ tên:</b> {viewDriver.firstName} {viewDriver.lastName}
            </p>
            <p>
              <b>Email:</b> {viewDriver.email}
            </p>
            <p>
              <b>Số điện thoại:</b> {viewDriver.phoneNumber || "—"}
            </p>
            <p>
              <b>Địa chỉ:</b> {viewDriver.address || "—"}
            </p>
            <p>
              <b>Ngày sinh:</b>{" "}
              {viewDriver.dateOfBirth
                ? dayjs(viewDriver.dateOfBirth).format("DD/MM/YYYY")
                : "—"}
            </p>
            <p>
              <b>CMND/CCCD:</b> {viewDriver.citizenId || "—"}
            </p>
          </div>
        ) : (
          <p>Đang tải thông tin...</p>
        )}
      </Modal>
    </>
  );
}
