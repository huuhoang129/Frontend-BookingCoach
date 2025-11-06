// src/containers/ModalsCollect/RouteListModal/TripPriceModal.tsx
import { useEffect } from "react";
import { Modal, Form, Select, Input, Button } from "antd";
import type {
  Route,
  TripPrice,
} from "../../../hooks/routerListHooks/useTripPrices";

const { Option } = Select;

interface TripPriceModalProps {
  openAdd: boolean;
  setOpenAdd: (v: boolean) => void;
  openEdit: boolean;
  setOpenEdit: (v: boolean) => void;
  formAdd: any;
  formEdit: any;
  handleAdd: () => void;
  handleEdit: () => void;
  routes: Route[];
  editingTripPrice: TripPrice | null;
}

export default function TripPriceModal({
  openAdd,
  setOpenAdd,
  openEdit,
  setOpenEdit,
  formAdd,
  formEdit,
  handleAdd,
  handleEdit,
  routes,
  editingTripPrice,
}: TripPriceModalProps) {
  useEffect(() => {
    if (openEdit && editingTripPrice) {
      formEdit.setFieldsValue(editingTripPrice);
    }
  }, [openEdit, editingTripPrice]);

  useEffect(() => {
    if (!openAdd) formAdd.resetFields();
  }, [openAdd]);

  const handleCancelAdd = () => setOpenAdd(false);
  const handleClickCancelAdd = () => {
    formAdd.resetFields();
    setOpenAdd(false);
  };
  const handleCancelEdit = () => setOpenEdit(false);
  const handleClickCancelEdit = () => setOpenEdit(false);

  return (
    <>
      {/* modal thêm mới */}
      <Modal
        title="Thêm giá vé"
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
            name="coachRouteId"
            label="Tuyến"
            rules={[{ required: true, message: "Vui lòng chọn tuyến" }]}
          >
            <Select placeholder="Chọn tuyến xe">
              {routes.length > 0 ? (
                routes.map((r) => (
                  <Option key={r.id} value={r.id}>
                    {r.fromLocation?.nameLocations} →{" "}
                    {r.toLocation?.nameLocations}
                  </Option>
                ))
              ) : (
                <Option disabled>Không có tuyến nào</Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="seatType"
            label="Loại ghế"
            rules={[{ required: true, message: "Vui lòng chọn loại ghế" }]}
          >
            <Select placeholder="Chọn loại ghế">
              <Option value="NORMAL">Ghế ngồi</Option>
              <Option value="SLEEPER">Giường nằm</Option>
              <Option value="DOUBLESLEEPER">Giường đôi</Option>
              <Option value="LIMOUSINE">Limousine</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="typeTrip"
            label="Loại chuyến"
            rules={[{ required: true, message: "Vui lòng chọn loại chuyến" }]}
          >
            <Select placeholder="Chọn loại chuyến">
              <Option value="NORMAL">Ngày thường</Option>
              <Option value="HOLIDAY">Ngày lễ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priceTrip"
            label="Giá vé (đ)"
            rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
          >
            <Input type="number" min={0} placeholder="Nhập giá vé..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* modal chỉnh sửa */}
      <Modal
        title="Sửa giá vé"
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
            name="coachRouteId"
            label="Tuyến"
            rules={[{ required: true, message: "Vui lòng chọn tuyến" }]}
          >
            <Select placeholder="Chọn tuyến xe">
              {routes.map((r) => (
                <Option key={r.id} value={r.id}>
                  {r.fromLocation?.nameLocations} →{" "}
                  {r.toLocation?.nameLocations}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="seatType"
            label="Loại ghế"
            rules={[{ required: true, message: "Vui lòng chọn loại ghế" }]}
          >
            <Select placeholder="Chọn loại ghế">
              <Option value="NORMAL">Ghế ngồi</Option>
              <Option value="SLEEPER">Giường nằm</Option>
              <Option value="DOUBLESLEEPER">Giường đôi</Option>
              <Option value="LIMOUSINE">Limousine</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="typeTrip"
            label="Loại chuyến"
            rules={[{ required: true, message: "Vui lòng chọn loại chuyến" }]}
          >
            <Select placeholder="Chọn loại chuyến">
              <Option value="NORMAL">Ngày thường</Option>
              <Option value="HOLIDAY">Ngày lễ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priceTrip"
            label="Giá vé (đ)"
            rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
          >
            <Input type="number" min={0} placeholder="Nhập giá vé..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
