//src/containers/ModalsCollect/StationModal/ProvinceModal.tsx
import { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import type { Province } from "../../../hooks/stationHooks/useLocationManage";

interface ProvinceModalProps {
  openAdd: boolean;
  setOpenAdd: (v: boolean) => void;
  openEdit: boolean;
  setOpenEdit: (v: boolean) => void;
  formAdd: any;
  formEdit: any;
  handleAdd: () => void;
  handleEdit: () => void;
  editingProvince: Province | null;
}

export default function ProvinceModal({
  openAdd,
  setOpenAdd,
  openEdit,
  setOpenEdit,
  formAdd,
  formEdit,
  handleAdd,
  handleEdit,
  editingProvince,
}: ProvinceModalProps) {
  useEffect(() => {
    if (openEdit && editingProvince) {
      formEdit.setFieldsValue(editingProvince);
    }
  }, [openEdit, editingProvince]);

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
      {/* modal thêm tỉnh */}
      <Modal
        title="Thêm tỉnh / thành phố"
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
            name="nameProvince"
            label="Tên tỉnh / thành phố"
            rules={[
              { required: true, message: "Vui lòng nhập tên tỉnh / thành phố" },
            ]}
          >
            <Input placeholder="VD: Hà Nội, TP.Hồ Chí Minh..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* modal sửa tỉnh */}
      <Modal
        title="Sửa tỉnh / thành phố"
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
            name="nameProvince"
            label="Tên tỉnh / thành phố"
            rules={[
              { required: true, message: "Vui lòng nhập tên tỉnh / thành phố" },
            ]}
          >
            <Input placeholder="VD: Hà Nội, TP.Hồ Chí Minh..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
