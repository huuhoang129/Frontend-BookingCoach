//src/containers/ModalsCollect/StationModal/LocationModal.tsx
import { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import type { Location } from "../../../hooks/stationHooks/useLocationManage";

const { Option } = Select;

interface LocationModalProps {
  openAdd: boolean;
  setOpenAdd: (v: boolean) => void;
  openEdit: boolean;
  setOpenEdit: (v: boolean) => void;
  formAdd: any;
  formEdit: any;
  handleAdd: () => void;
  handleEdit: () => void;
  editingLocation: Location | null;
  provinces: any[];
}

export default function LocationModal({
  openAdd,
  setOpenAdd,
  openEdit,
  setOpenEdit,
  formAdd,
  formEdit,
  handleAdd,
  handleEdit,
  editingLocation,
  provinces,
}: LocationModalProps) {
  useEffect(() => {
    if (openEdit && editingLocation) {
      formEdit.setFieldsValue({
        ...editingLocation,
        provinceId: editingLocation.provinceId,
      });
    }
  }, [openEdit, editingLocation]);

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
      {/* modal thêm địa điểm */}
      <Modal
        title="Thêm địa điểm mới"
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
            name="nameLocations"
            label="Tên địa điểm"
            rules={[{ required: true, message: "Vui lòng nhập tên địa điểm" }]}
          >
            <Input placeholder="VD: Bến xe Mỹ Đình, Điểm dừng Trung Tâm..." />
          </Form.Item>

          <Form.Item
            name="provinceId"
            label="Thuộc tỉnh / thành phố"
            rules={[
              { required: true, message: "Vui lòng chọn tỉnh / thành phố" },
            ]}
          >
            <Select placeholder="Chọn tỉnh / thành phố">
              {provinces.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.nameProvince}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại địa điểm"
            initialValue="STATION"
            rules={[{ required: true, message: "Vui lòng chọn loại địa điểm" }]}
          >
            <Select>
              <Option value="STATION">Bến xe</Option>
              <Option value="STOP_POINT">Điểm dừng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* modal sửa địa điểm */}
      <Modal
        title="Sửa địa điểm"
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
            name="nameLocations"
            label="Tên địa điểm"
            rules={[{ required: true, message: "Vui lòng nhập tên địa điểm" }]}
          >
            <Input placeholder="VD: Bến xe Mỹ Đình, Điểm dừng Trung Tâm..." />
          </Form.Item>

          <Form.Item
            name="provinceId"
            label="Thuộc tỉnh / thành phố"
            rules={[
              { required: true, message: "Vui lòng chọn tỉnh / thành phố" },
            ]}
          >
            <Select placeholder="Chọn tỉnh / thành phố">
              {provinces.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.nameProvince}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại địa điểm"
            rules={[{ required: true, message: "Vui lòng chọn loại địa điểm" }]}
          >
            <Select>
              <Option value="STATION">Bến xe</Option>
              <Option value="STOP_POINT">Điểm dừng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
