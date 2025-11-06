//src/containers/ModalsCollect/VehicleModal/VehicleStatusModal.tsx
import { useEffect } from "react";
import { Modal, Form, Select, Input, Button } from "antd";
import type {
  Vehicle,
  VehicleStatus,
} from "../../../hooks/vehicleHooks/useVehicleStatus";

const { Option } = Select;

interface VehicleStatusModalProps {
  openAdd: boolean;
  setOpenAdd: (v: boolean) => void;
  openEdit: boolean;
  setOpenEdit: (v: boolean) => void;
  formAdd: any;
  formEdit: any;
  handleAdd: () => void;
  handleEdit: () => void;
  editingStatus: VehicleStatus | null;
  vehicles: Vehicle[];
}

export default function VehicleStatusModal({
  openAdd,
  setOpenAdd,
  openEdit,
  setOpenEdit,
  formAdd,
  formEdit,
  handleAdd,
  handleEdit,
  editingStatus,
  vehicles,
}: VehicleStatusModalProps) {
  // cập nhật form khi chỉnh sửa
  useEffect(() => {
    if (openEdit && editingStatus) {
      formEdit.setFieldsValue({
        vehicleId: editingStatus.vehicle?.id,
        status: editingStatus.status,
        note: editingStatus.note,
      });
    }
  }, [openEdit, editingStatus]);

  // reset form khi đóng
  const handleCancelAdd = () => setOpenAdd(false);
  const handleClickCancelAdd = () => {
    formAdd.resetFields();
    setOpenAdd(false);
  };

  const handleCancelEdit = () => setOpenEdit(false);
  const handleClickCancelEdit = () => {
    formEdit.resetFields();
    setOpenEdit(false);
  };

  return (
    <>
      {/* Modal thêm tình trạng xe */}
      <Modal
        title="Cập nhật tình trạng xe"
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
            name="vehicleId"
            label="Xe"
            rules={[{ required: true, message: "Vui lòng chọn xe" }]}
          >
            <Select placeholder="Chọn xe">
              {vehicles.map((v) => (
                <Option key={v.id} value={v.id}>
                  {v.licensePlate} - {v.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="GOOD">Tốt</Option>
              <Option value="NEEDS_MAINTENANCE">Cần bảo dưỡng</Option>
              <Option value="IN_REPAIR">Đang sửa chữa</Option>
            </Select>
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={2} placeholder="Ghi chú thêm (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* modal cập nhật tình trạng xe */}
      <Modal
        title="Chỉnh sửa tình trạng xe"
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
            name="vehicleId"
            label="Xe"
            rules={[{ required: true, message: "Vui lòng chọn xe" }]}
          >
            <Select placeholder="Chọn xe">
              {vehicles.map((v) => (
                <Option key={v.id} value={v.id}>
                  {v.licensePlate} - {v.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="GOOD">Tốt</Option>
              <Option value="NEEDS_MAINTENANCE">Cần bảo dưỡng</Option>
              <Option value="IN_REPAIR">Đang sửa chữa</Option>
            </Select>
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={2} placeholder="Ghi chú thêm (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
