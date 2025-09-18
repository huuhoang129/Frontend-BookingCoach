import { useState, useEffect } from "react";
import {
  createBanner,
  getAllBanners,
  getAllBannerById,
  editBanner,
  deleteBanner,
} from "../services/systemServices/bannerServices.ts";
import { toBase64 } from "../utils/base64";

export interface Banner {
  id: number;
  image: string;
  title: string;
}

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerData, setBannerData] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);

  // fetch all
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getAllBanners();
      setBanners(res.data.data || []);
    } catch (error) {
      console.error("❌ Lỗi khi fetch banners:", error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  // view one
  const handleOpenView = async (id: number) => {
    try {
      const res = await getAllBannerById(id);
      setBannerData(res.data?.data || res.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy banner:", error);
    }
  };

  // create
  const handleCreate = async (values: any) => {
    try {
      const fileObj = values.image?.[0];
      const imageBase64 = fileObj ? fileObj.thumbUrl?.split(",")[1] || "" : "";

      const payload = { title: values.title, imageBase64 };
      await createBanner(payload);

      alert("Thêm mới banner thành công!");
      fetchBanners();
    } catch (error) {
      console.error("❌ Lỗi thêm mới:", error);
      alert("Thêm mới thất bại!");
    }
  };

  // edit
  const handleEdit = async (values: any) => {
    try {
      const fileList = values.image;
      let imageBase64 = "";

      if (fileList && fileList.length > 0) {
        const fileObj = fileList[0].originFileObj as File;
        imageBase64 = await toBase64(fileObj);
        imageBase64 = imageBase64.split(",")[1];
      }

      const payload = {
        id: bannerData?.id,
        title: values.title,
        imageBase64,
      };

      await editBanner(payload);
      alert("Cập nhật banner thành công!");
      fetchBanners();
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };

  // delete
  const handleDelete = async (id: number) => {
    try {
      await deleteBanner(id);
      alert("Xoá banner thành công!");
      fetchBanners();
    } catch (error) {
      console.error("❌ Lỗi khi xoá banner:", error);
      alert("Xoá thất bại!");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return {
    banners,
    bannerData,
    setBannerData,
    loading,
    fetchBanners,
    handleOpenView,
    handleCreate,
    handleEdit,
    handleDelete,
  };
}
