//src/hooks/systemHooks/useBanners.ts
import { useEffect, useState } from "react";
import { Form } from "antd";
import {
  createBanner,
  getAllBanners,
  getAllBannerById,
  editBanner,
  deleteBanner,
} from "../../services/systemServices/bannerServices";
import { toBase64 } from "../../utils/base64";
import { AppNotification } from "../../components/Notification/AppNotification";

// types
export interface Banner {
  id: number;
  image: string;
  title: string;
}

export function useBanners() {
  // state dữ liệu
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerData, setBannerData] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);

  // modal form state
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // fetch danh sách banner
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getAllBanners();
      if (res.data.errCode === 0) {
        setBanners(res.data.data || []);
      } else {
        notifyError("Lỗi hệ thống", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách banner.");
    } finally {
      setLoading(false);
    }
  };

  // fetch banner theo id
  const handleOpenView = async (id: number) => {
    try {
      const res = await getAllBannerById(id);
      if (res.data.errCode === 0) {
        setBannerData(res.data.data || null);
      } else {
        notifyError("Lỗi hệ thống", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải chi tiết banner.");
    }
  };

  // thêm mới banner
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      const file = values.image?.[0]?.originFileObj as File;
      const base64 = file ? (await toBase64(file)).split(",")[1] : "";

      const res = await createBanner({
        title: values.title,
        imageBase64: base64,
      });

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        form.resetFields();
        setIsAddModal(false);
        fetchBanners();
      } else {
        notifyError("Lỗi hệ thống", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể thêm banner.");
    }
  };

  // cập nhật banner
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!bannerData) return;

      const fileList = values.image;
      let base64 = "";
      if (fileList && fileList.length > 0) {
        const fileObj = fileList[0].originFileObj as File;
        base64 = (await toBase64(fileObj)).split(",")[1];
      }

      const res = await editBanner({
        id: bannerData.id,
        title: values.title,
        imageBase64: base64,
      });

      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        setIsEditModal(false);
        setBannerData(null);
        fetchBanners();
      } else {
        notifyError("Lỗi hệ thống", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật banner.");
    }
  };

  // xoá banner
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteBanner(id);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        fetchBanners();
      } else {
        notifyError("Lỗi hệ thống", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá banner.");
    }
  };

  // xoá nhiều banner
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;

    try {
      setLoading(true);
      const results = await Promise.all(ids.map((id) => deleteBanner(id)));
      const hasError = results.some((res) => res.data.errCode !== 0);

      if (hasError) {
        notifyError(
          "Lỗi hệ thống",
          "Một số banner không thể xoá. Vui lòng thử lại."
        );
      } else {
        notifySuccess("Thành công", "Đã xoá các banner đã chọn.");
      }

      fetchBanners();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá các banner đã chọn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // return
  return {
    banners,
    bannerData,
    setBannerData,
    loading,
    fetchBanners,
    handleOpenView,
    handleAdd,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    isAddModal,
    setIsAddModal,
    isEditModal,
    setIsEditModal,
    form,
    editForm,
    contextHolder,
  };
}
