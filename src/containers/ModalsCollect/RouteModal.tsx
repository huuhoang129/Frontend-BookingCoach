import { CustomModal } from "../../components/ui/Modal/Modal";
import { FormSelect } from "../../components/ui/Form/FormSelect";
import { FormImageUpload } from "../../components/ui/Form/FormImageUpload";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  fromOptions: any[];
  toOptions: any[];
  setFromProvinceId: (id: number | null) => void;
  form: any;
  mode: "create" | "edit";
  editingRoute?: any;
}

export function RouteModal({
  open,
  onClose,
  onSubmit,
  fromOptions,
  toOptions,
  setFromProvinceId,
  form,
  mode,
  editingRoute,
}: Props) {
  return (
    <CustomModal
      open={open}
      title={mode === "create" ? "Thêm tuyến mới" : "Cập nhật tuyến"}
      initialValues={
        mode === "edit" && editingRoute
          ? {
              fromLocationId: String(editingRoute.fromLocation.id),
              toLocationId: String(editingRoute.toLocation.id),
              image: editingRoute.imageRouteCoach
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
            }
          : {}
      }
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <FormImageUpload
        label="Ảnh tuyến đi"
        name="image"
        buttonText="Chọn ảnh"
        listType="picture-card"
        multiple={false}
      />

      <FormSelect
        label="Bến Đi"
        name="fromLocationId"
        placeholder="Chọn điểm đi"
        rules={[{ required: true, message: "Bắt buộc chọn điểm đi" }]}
        options={fromOptions}
        onChange={(value: string) => {
          const loc = fromOptions.find((l) => l.value === value);
          setFromProvinceId(loc?.provinceId ?? null);
          form.setFieldsValue({ toLocationId: undefined });
        }}
      />

      <FormSelect
        label="Bến Đến"
        name="toLocationId"
        placeholder="Chọn điểm đến"
        rules={[{ required: true, message: "Bắt buộc chọn điểm đến" }]}
        options={toOptions}
      />
    </CustomModal>
  );
}
