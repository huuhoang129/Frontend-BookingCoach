//src/containers/ModalsCollect/StationModal/RouteModal.tsx
import { useEffect } from "react";
import { Modal, Form, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { Route } from "../../../hooks/stationHooks/useRouteManage";

const { Option } = Select;

interface RouteModalProps {
  openAdd: boolean;
  setOpenAdd: (v: boolean) => void;
  openEdit: boolean;
  setOpenEdit: (v: boolean) => void;
  formAdd: any;
  formEdit: any;
  handleAdd: () => void;
  handleEdit: () => void;
  editingRoute: Route | null;
  locations: any[];
}

export default function RouteModal({
  openAdd,
  setOpenAdd,
  openEdit,
  setOpenEdit,
  formAdd,
  formEdit,
  handleAdd,
  handleEdit,
  editingRoute,
  locations,
}: RouteModalProps) {
  useEffect(() => {
    if (openEdit && editingRoute) {
      formEdit.setFieldsValue({
        fromLocationId: editingRoute.fromLocation?.id,
        toLocationId: editingRoute.toLocation?.id,
        imageRouteCoach: editingRoute.imageRouteCoach
          ? [
              {
                uid: String(editingRoute.id),
                name: "route-image.png",
                status: "done",
                url: editingRoute.imageRouteCoach.startsWith("data:image")
                  ? editingRoute.imageRouteCoach
                  : `data:image/png;base64,${editingRoute.imageRouteCoach}`,
              },
            ]
          : [],
      });
    }
  }, [openEdit, editingRoute]);

  // close modal
  const closeAdd = () => {
    formAdd.resetFields();
    setOpenAdd(false);
  };

  const closeEdit = () => {
    formEdit.resetFields();
    setOpenEdit(false);
  };

  const fromAdd = Form.useWatch("fromLocationId", formAdd);
  const fromEdit = Form.useWatch("fromLocationId", formEdit);

  const renderToOptions = (currentFromId?: number) => {
    if (!currentFromId) {
      return locations.map((l) => (
        <Option key={l.id} value={l.id}>
          {l.nameLocations} ({l.province?.nameProvince})
        </Option>
      ));
    }

    const from = locations.find((loc) => loc.id === currentFromId);
    return locations
      .filter((l) =>
        from && from.province ? l.province?.id !== from.province.id : true
      )
      .map((l) => (
        <Option key={l.id} value={l.id}>
          {l.nameLocations} ({l.province?.nameProvince})
        </Option>
      ));
  };

  return (
    <>
      {/* modal thêm tuyến*/}
      <Modal
        title="Thêm tuyến đường"
        open={openAdd}
        onCancel={closeAdd}
        width={480}
        centered
        footer={[
          <Button key="cancel" onClick={closeAdd}>
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
            name="fromLocationId"
            label="Điểm đi"
            rules={[{ required: true, message: "Vui lòng chọn điểm đi" }]}
          >
            <Select
              placeholder="Chọn điểm đi"
              onChange={() =>
                formAdd.setFieldsValue({ toLocationId: undefined })
              }
            >
              {locations.map((l) => (
                <Option key={l.id} value={l.id}>
                  {l.nameLocations} ({l.province?.nameProvince})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="toLocationId"
            label="Điểm đến"
            rules={[{ required: true, message: "Vui lòng chọn điểm đến" }]}
          >
            <Select placeholder="Chọn điểm đến">
              {renderToOptions(fromAdd)}
            </Select>
          </Form.Item>

          <Form.Item
            name="imageRouteCoach"
            label="Ảnh tuyến đường"
            valuePropName="fileList"
            rules={[
              { required: true, message: "Vui lòng chọn ảnh tuyến đường" },
            ]}
            getValueFromEvent={(e) =>
              Array.isArray(e) ? e : e?.fileList || []
            }
          >
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* modal cập nhật tuyến */}
      <Modal
        title="Sửa tuyến đường"
        open={openEdit}
        onCancel={closeEdit}
        width={480}
        centered
        footer={[
          <Button key="cancel" onClick={closeEdit}>
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
            name="fromLocationId"
            label="Điểm đi"
            rules={[{ required: true, message: "Vui lòng chọn điểm đi" }]}
          >
            <Select
              placeholder="Chọn điểm đi"
              onChange={() =>
                formEdit.setFieldsValue({ toLocationId: undefined })
              }
            >
              {locations.map((l) => (
                <Option key={l.id} value={l.id}>
                  {l.nameLocations} ({l.province?.nameProvince})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="toLocationId"
            label="Điểm đến"
            rules={[{ required: true, message: "Vui lòng chọn điểm đến" }]}
          >
            <Select placeholder="Chọn điểm đến">
              {renderToOptions(fromEdit)}
            </Select>
          </Form.Item>

          <Form.Item
            name="imageRouteCoach"
            label="Ảnh tuyến đường"
            valuePropName="fileList"
            rules={[
              { required: true, message: "Vui lòng chọn ảnh tuyến đường" },
            ]}
            getValueFromEvent={(e) =>
              Array.isArray(e) ? e : e?.fileList || []
            }
          >
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
