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

  //fetch data banner
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getAllBanners();
      setBanners(res.data.data || []);
    } catch {
      notifyError("Không thể tải danh sách banner", "");
    } finally {
      setLoading(false);
    }
  };

  // fetch banner theo id
  const handleOpenView = async (id: number) => {
    try {
      const res = await getAllBannerById(id);
      setBannerData(res.data?.data || res.data);
    } catch {
      notifyError("Không thể tải chi tiết banner", "");
    }
  };

  // thêm mới banenr
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      const file = values.image?.[0]?.originFileObj as File;
      const base64 = file ? (await toBase64(file)).split(",")[1] : "";

      await createBanner({
        title: values.title,
        imageBase64: base64,
      });

      notifySuccess("Thêm mới thành công", "Banner đã được thêm.");
      form.resetFields();
      setIsAddModal(false);
      fetchBanners();
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
      await editBanner({
        id: bannerData.id,
        title: values.title,
        imageBase64: base64,
      });
      notifySuccess("Cập nhật thành công", "Banner đã được cập nhật.");
      setIsEditModal(false);
      setBannerData(null);
      fetchBanners();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể cập nhật banner.");
    }
  };

  // xáo banner
  const handleDelete = async (id: number) => {
    try {
      await deleteBanner(id);
      notifySuccess("Xoá thành công", "Banner đã bị xoá.");
      fetchBanners();
    } catch {
      notifyError("Lỗi hệ thống", "Không thể xoá banner.");
    }
  };

  // xóa nhiều banner
  const handleBulkDelete = async (ids: number[]) => {
    if (!ids.length) return;

    try {
      setLoading(true);
      await Promise.all(ids.map((id) => deleteBanner(id)));
      notifySuccess("Xoá thành công", "Đã xoá các banner đã chọn.");
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
