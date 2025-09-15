import { useEffect, useState } from "react";

// Services
import {
  createBanner,
  getAllBanners,
  getAllBannerById,
  editBanner,
  deleteBanner,
} from "../../../services/systemServices/bannerServices.ts";

// UI – Buttons
import CreateButton from "../../../components/ui/Button/Create";
import DeleteButton from "../../../components/ui/Button/Delete";
import EditButton from "../../../components/ui/Button/Edit";
import QuickViewButton from "../../../components/ui/Button/quickView";

// UI – Form
import { FormInput } from "../../../components/ui/Form/FormInput";
import { FormImageUpload } from "../../../components/ui/Form/FormImageUpload";
import { FormImagePreview } from "../../../components/ui/Form/FormImageReview";

// UI – Table & Pagination
import BaseTable from "../../../components/ui/Table/Table";
import Pagination from "../../../components/ui/Pagination/Pagination";

// Containers / Modal
import { CustomModal } from "../../../components/ui/Modal/Modal.tsx";

import { usePagination } from "../../../hooks/usePagination.ts";
import { toBase64 } from "../../../utils/base64.ts";

type Banner = {
  id: number;
  image: string;
  title: string;
};

export default function BannerManage() {
  // --- State liên quan đến modal ---
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // --- State dữ liệu ---
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerData, setBannerData] = useState<any>(null);

  const handleOpenView = async (id: number) => {
    try {
      const res = await getAllBannerById(id);
      setBannerData(res.data?.data || res.data);
      setOpenView(true);
    } catch (error) {
      console.error("❌ Lỗi khi lấy banner:", error);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await getAllBanners();
      setBanners(res.data.data || []);
    } catch (error) {
      setBanners([]);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const fileObj = values.image?.[0];
      const imageBase64 = fileObj ? fileObj.thumbUrl?.split(",")[1] || "" : "";

      const payload = { title: values.title, imageBase64 };

      await createBanner(payload);
      alert("Thêm mới thành công!");
      setOpen(false);
      fetchBanners();
    } catch (error) {
      console.error("❌ Lỗi thêm mới:", error);
    }
  };

  const handleEdit = async (values: any) => {
    try {
      const fileList = values.image;
      let imageBase64 = "";

      if (fileList && fileList.length > 0) {
        const fileObj = fileList[0].originFileObj as File;
        imageBase64 = await toBase64(fileObj);
        imageBase64 = imageBase64.split(",")[1]; // bỏ prefix
      }

      const payload = {
        id: bannerData.id,
        title: values.title,
        imageBase64,
      };

      await editBanner(payload);
      setOpenEdit(false);
      fetchBanners();
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBanner(id);
      alert("Xoá thành công!");
      fetchBanners();
    } catch (error) {
      console.error("❌ Lỗi khi xoá banner:", error);
      alert("Xoá thất bại!");
    }
  };

  // -------------------- Effects --------------------
  useEffect(() => {
    fetchBanners();
  }, []);

  // -------------------- Pagination logic --------------------
  const itemsPerPage = 4;
  const { currentPage, displayedItems, handlePageChange } = usePagination(
    banners,
    itemsPerPage
  );

  return (
    <div className="panel-banner-admin">
      <div>
        <h2>Quản Lý Banner</h2>
        <div>
          <CreateButton onClick={() => setOpen(true)}>
            + Thêm mới Banner
          </CreateButton>
          <CustomModal
            open={open}
            title="Thêm Banner"
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
          >
            <FormInput name="title" label="Tiêu đề" />
            <FormImageUpload name="image" />
          </CustomModal>
        </div>
      </div>

      <div>
        <BaseTable>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tiêu đề</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((banner) => (
              <tr key={banner.id}>
                <td>
                  <img
                    src={`data:image/png;base64,${banner.image}`}
                    alt={banner.title}
                    width={120}
                  />
                </td>
                <td>
                  <span>{banner.title}</span>
                </td>
                <td>
                  <QuickViewButton onClick={() => handleOpenView(banner.id)}>
                    Xem
                  </QuickViewButton>

                  <EditButton
                    onClick={() => {
                      setBannerData(banner);
                      setOpenEdit(true);
                    }}
                  >
                    Sửa
                  </EditButton>

                  <DeleteButton onClick={() => handleDelete(banner.id)}>
                    Xoá
                  </DeleteButton>
                </td>
              </tr>
            ))}
            {displayedItems.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  style={{ textAlign: "center", padding: "16px" }}
                >
                  Không có banner nào
                </td>
              </tr>
            )}
          </tbody>
        </BaseTable>
      </div>

      {/* Modal Xem */}
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
              value={bannerData?.title || ""}
              disabled
            />
          </>
        ) : (
          <p>Đang tải...</p>
        )}
      </CustomModal>

      {/* Modal Sửa */}
      <CustomModal
        open={openEdit}
        title="Sửa Banner"
        onClose={() => setOpenEdit(false)}
        onSubmit={handleEdit}
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

      <div>
        <Pagination
          totalItems={banners.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
