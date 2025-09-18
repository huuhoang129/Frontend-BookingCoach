import { useState } from "react";

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
import { useBanners } from "../../../hooks/useBanners";

export default function BannerManage() {
  const {
    banners,
    bannerData,
    setBannerData,
    handleOpenView,
    handleCreate,
    handleEdit,
    handleDelete,
  } = useBanners();

  // Modal state
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // Pagination
  const itemsPerPage = 4;
  const { currentPage, displayedItems, handlePageChange } = usePagination(
    banners,
    itemsPerPage
  );

  return (
    <div className="panel-banner-admin">
      <h2>Quản Lý Banner</h2>

      {/* Create */}
      <CreateButton onClick={() => setOpen(true)}>
        + Thêm mới Banner
      </CreateButton>
      <CustomModal
        open={open}
        title="Thêm Banner"
        onClose={() => setOpen(false)}
        onSubmit={handleCreate}
      >
        <FormInput name="title" label="Tiêu đề" />
        <FormImageUpload name="image" />
      </CustomModal>

      {/* Table */}
      <BaseTable>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedItems.length > 0 ? (
            displayedItems.map((banner) => (
              <tr key={banner.id}>
                <td>
                  <img
                    src={`data:image/png;base64,${banner.image}`}
                    alt={banner.title}
                    width={120}
                  />
                </td>
                <td>{banner.title}</td>
                <td>
                  <QuickViewButton
                    onClick={async () => {
                      await handleOpenView(banner.id);
                      setOpenView(true);
                    }}
                  >
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
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "16px" }}>
                Không có banner nào
              </td>
            </tr>
          )}
        </tbody>
      </BaseTable>

      {/* View Modal */}
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

      {/* Edit Modal */}
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

      {/* Pagination */}
      <Pagination
        totalItems={banners.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
