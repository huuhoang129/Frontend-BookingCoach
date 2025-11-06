// src/containers/ModalsCollect/VehicleModal/VehicleModal.tsx
import { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import type { Vehicle } from "../../../hooks/vehicleHooks/useVehicles";

const { Option } = Select;

interface VehicleModalProps {
  openAdd: boolean;
  setOpenAdd: (v: boolean) => void;
  openEdit: boolean;
  setOpenEdit: (v: boolean) => void;
  formAdd: any;
  formEdit: any;
  handleAdd: () => void;
  handleEdit: () => void;
  editingVehicle: Vehicle | null;
}

export default function VehicleModal({
  openAdd,
  setOpenAdd,
  openEdit,
  setOpenEdit,
  formAdd,
  formEdit,
  handleAdd,
  handleEdit,
  editingVehicle,
}: VehicleModalProps) {
  // cập nhật form khi chỉnh sửa
  useEffect(() => {
    if (openEdit && editingVehicle) {
      formEdit.setFieldsValue(editingVehicle);
    }
  }, [openEdit, editingVehicle]);
  // reset form
  useEffect(() => {
    if (!openAdd) formAdd.resetFields();
  }, [openAdd]);

  // xử lý đóng modal
  const handleCancelAdd = () => setOpenAdd(false);
  const handleClickCancelAdd = () => {
    formAdd.resetFields();
    setOpenAdd(false);
  };
  const handleCancelEdit = () => setOpenEdit(false);
  const handleClickCancelEdit = () => setOpenEdit(false);

  return (
    <>
      {/* modal thêm xe */}
      <Modal
        title="Thêm xe mới"
        open={openAdd}
        onCancel={handleCancelAdd}
        width={450}
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
            name="name"
            label="Tên xe"
            rules={[{ required: true, message: "Vui lòng nhập tên xe" }]}
          >
            <Input placeholder="Nhập tên xe..." />
          </Form.Item>

          <Form.Item
            name="licensePlate"
            label="Biển số"
            rules={[{ required: true, message: "Vui lòng nhập biển số" }]}
          >
            <Input placeholder="Nhập biển số xe..." />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Mô tả thêm (nếu có)" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại xe"
            rules={[{ required: true, message: "Vui lòng chọn loại xe" }]}
          >
            <Select placeholder="Chọn loại xe">
              <Option value="Normal">Normal (45 ghế)</Option>
              <Option value="Sleeper">Sleeper (36 ghế - 2 tầng)</Option>
              <Option value="DoubleSleeper">
                DoubleSleeper (22 ghế - 2 tầng)
              </Option>
              <Option value="Limousine">Limousine (9 ghế)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* modal chỉnh sửa xe */}
      <Modal
        title="Chỉnh sửa xe"
        open={openEdit}
        onCancel={handleCancelEdit}
        width={450}
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
            name="name"
            label="Tên xe"
            rules={[{ required: true, message: "Vui lòng nhập tên xe" }]}
          >
            <Input placeholder="Nhập tên xe..." />
          </Form.Item>

          <Form.Item
            name="licensePlate"
            label="Biển số"
            rules={[{ required: true, message: "Vui lòng nhập biển số" }]}
          >
            <Input placeholder="Nhập biển số xe..." />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Mô tả thêm (nếu có)" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại xe"
            rules={[{ required: true, message: "Vui lòng chọn loại xe" }]}
          >
            <Select placeholder="Chọn loại xe">
              <Option value="Normal">Normal (45 ghế)</Option>
              <Option value="Sleeper">Sleeper (36 ghế - 2 tầng)</Option>
              <Option value="DoubleSleeper">
                DoubleSleeper (22 ghế - 2 tầng)
              </Option>
              <Option value="Limousine">Limousine (9 ghế)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
