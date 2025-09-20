import { CustomModal } from "../../components/ui/Modal/Modal";
import { FormInput } from "../../components/ui/Form/FormInput";
import { FormImageUpload } from "../../components/ui/Form/FormImageUpload";
import { FormImagePreview } from "../../components/ui/Form/FormImageReview";

interface BannerModalsProps {
  openCreate: boolean;
  setOpenCreate: (val: boolean) => void;
  openView: boolean;
  setOpenView: (val: boolean) => void;
  openEdit: boolean;
  setOpenEdit: (val: boolean) => void;

  bannerData: any;
  handlers: {
    handleCreate: (values: any) => void;
    handleEdit: (values: any) => void;
  };
}

export default function BannerModals({
  openCreate,
  setOpenCreate,
  openView,
  setOpenView,
  openEdit,
  setOpenEdit,
  bannerData,
  handlers,
}: BannerModalsProps) {
  return (
    <>
      {/* Create */}
      <CustomModal
        open={openCreate}
        title="Thêm Banner"
        onClose={() => setOpenCreate(false)}
        onSubmit={handlers.handleCreate}
      >
        <FormInput name="title" label="Tiêu đề" />
        <FormImageUpload name="image" />
      </CustomModal>

      {/* View */}
      <CustomModal
        open={openView}
        title="Xem Banner"
        onClose={() => setOpenView(false)}
        onSubmit={() => {}}
        initialValues={bannerData || {}}
      >
        {bannerData ? (
          <>
            <FormImagePreview
              label="Ảnh Banner"
              src={`data:image/png;base64,${bannerData.image}`}
              name="bannerImage"
            />
            <FormInput
              name="title"
              label="Tiêu đề"
              value={bannerData.title}
              disabled
            />
          </>
        ) : (
          <p>Đang tải...</p>
        )}
      </CustomModal>

      {/* Edit */}
      <CustomModal
        open={openEdit}
        title="Sửa Banner"
        onClose={() => setOpenEdit(false)}
        onSubmit={handlers.handleEdit}
        initialValues={
          bannerData
            ? {
                ...bannerData,
                image: [
                  {
                    uid: "-1",
                    name: "banner.png",
                    status: "done",
                    url: `data:image/png;base64,${bannerData.image}`,
                  },
                ],
              }
            : {}
        }
      >
        <FormInput
          name="title"
          label="Tiêu đề"
          value={bannerData?.title || ""}
        />
        <FormImageUpload name="image" />
      </CustomModal>
    </>
  );
}
