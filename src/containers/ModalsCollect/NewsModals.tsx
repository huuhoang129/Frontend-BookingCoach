//src/containers/ModalsCollect/NewsModals.tsx
import { CustomModal } from "../../components/ui/Modal/Modal";
import { FormInput } from "../../components/ui/Form/FormInput";
import { FormSelect } from "../../components/ui/Form/FormSelect";
import { FormImageUpload } from "../../components/ui/Form/FormImageUpload";
import { FormMarkDown } from "../../components/ui/Form/FormMarkDown";
import { Form } from "antd";

interface NewsModalsProps {
  openCreate: boolean;
  setOpenCreate: (val: boolean) => void;
  openEdit: boolean;
  setOpenEdit: (val: boolean) => void;
  selectedNews: any;
  handlers: {
    handleCreate: (values: any, cb?: () => void) => void;
    handleEdit: (values: any, cb?: () => void) => void;
  };
}

export default function NewsModals({
  openCreate,
  setOpenCreate,
  openEdit,
  setOpenEdit,
  selectedNews,
  handlers,
}: NewsModalsProps) {
  return (
    <>
      {/* Modal Create */}
      <CustomModal
        open={openCreate}
        title="Thêm tin tức"
        onClose={() => setOpenCreate(false)}
        width={1000}
        onSubmit={(values) =>
          handlers.handleCreate(values, () => setOpenCreate(false))
        }
      >
        <FormImageUpload name="thumbnail" label="Ảnh tiêu đề" />
        <FormInput name="title" label="Tiêu đề" />
        <FormSelect
          name="status"
          label="Trạng thái"
          options={[
            { label: "Bản nháp", value: "Draft" },
            { label: "Đã xuất bản", value: "Published" },
          ]}
        />
        <FormSelect
          name="newsType"
          label="Loại tin"
          options={[
            { value: "News", label: "Tin thường" },
            { value: "Featured", label: "Tin nổi bật" },
            { value: "Recruitment", label: "Tin tuyển dụng" },
            { value: "Service", label: "Tin dịch vụ" },
          ]}
          rules={[{ required: true, message: "Chọn loại tin" }]}
        />
        <Form.Item name="content" label="Nội dung">
          <FormMarkDown folder="news" />
        </Form.Item>
      </CustomModal>

      {/* Modal Edit */}
      <CustomModal
        open={openEdit}
        title="Sửa tin tức"
        onClose={() => setOpenEdit(false)}
        width={1000}
        onSubmit={(values) =>
          handlers.handleEdit(values, () => setOpenEdit(false))
        }
        initialValues={selectedNews || {}}
      >
        <FormImageUpload name="thumbnail" label="Ảnh tiêu đề" />
        <FormInput name="title" label="Tiêu đề" />
        <FormSelect
          name="status"
          label="Trạng thái"
          options={[
            { label: "Bản nháp", value: "Draft" },
            { label: "Đã xuất bản", value: "Published" },
          ]}
        />
        <FormSelect
          name="newsType"
          label="Loại tin"
          options={[
            { value: "News", label: "Tin thường" },
            { value: "Featured", label: "Tin nổi bật" },
            { value: "Recruitment", label: "Tin tuyển dụng" },
            { value: "Service", label: "Tin dịch vụ" },
          ]}
          rules={[{ required: true, message: "Chọn loại tin" }]}
        />
        <Form.Item name="content" label="Nội dung">
          <FormMarkDown folder="news" />
        </Form.Item>
      </CustomModal>
    </>
  );
}
