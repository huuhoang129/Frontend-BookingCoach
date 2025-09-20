import { useState } from "react";

import CreateButton from "../../../components/ui/Button/Create";
import DeleteButton from "../../../components/ui/Button/Delete";
import EditButton from "../../../components/ui/Button/Edit";
import QuickViewButton from "../../../components/ui/Button/quickView";
import BannerModals from "../../../containers/ModalsCollect/BannerModals";
import BaseTable from "../../../components/ui/Table/Table";
import Pagination from "../../../components/ui/Pagination/Pagination";

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

      <BannerModals
        openCreate={open}
        setOpenCreate={setOpen}
        openView={openView}
        setOpenView={setOpenView}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        bannerData={bannerData}
        handlers={{
          handleCreate,
          handleEdit,
        }}
      />

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
