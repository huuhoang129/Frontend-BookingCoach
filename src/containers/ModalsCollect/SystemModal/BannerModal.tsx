import { useEffect } from "react";
import { Modal, Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { Banner } from "../../../hooks/systemHooks/useBanners";

interface BannerModalProps {
  openAdd: boolean;
  setOpenAdd: (v: boolean) => void;
  openEdit: boolean;
  setOpenEdit: (v: boolean) => void;
  formAdd: any;
  formEdit: any;
  handleAdd: () => void;
  handleEdit: () => void;
  editingBanner: Banner | null;
}

export default function BannerModal({
  openAdd,
  setOpenAdd,
  openEdit,
  setOpenEdit,
  formAdd,
  formEdit,
  handleAdd,
  handleEdit,
  editingBanner,
}: BannerModalProps) {
  //prefill data khi mở
  useEffect(() => {
    if (openEdit && editingBanner) {
      formEdit.setFieldsValue({
        title: editingBanner.title,
        image: [],
      });
    }
  }, [openEdit, editingBanner]);

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
      {/* modal thêm mới*/}
      <Modal
        title="Thêm mới Banner"
        open={openAdd}
        onCancel={handleCancelAdd}
        centered
        width={480}
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
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Nhập tiêu đề banner" }]}
          >
            <Input placeholder="Nhập tiêu đề banner..." />
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh banner"
            valuePropName="fileList"
            rules={[{ required: true, message: "Chọn ảnh banner" }]}
            getValueFromEvent={(e) =>
              Array.isArray(e) ? e : e?.fileList || []
            }
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* modal cập nhật banner */}
      <Modal
        title="Chỉnh sửa Banner"
        open={openEdit}
        onCancel={handleCancelEdit}
        centered
        width={480}
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
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Nhập tiêu đề banner" }]}
          >
            <Input placeholder="Nhập tiêu đề banner..." />
          </Form.Item>

          <Form.Item
            name="image"
            label="Cập nhật ảnh (tuỳ chọn)"
            valuePropName="fileList"
            getValueFromEvent={(e) =>
              Array.isArray(e) ? e : e?.fileList || []
            }
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
