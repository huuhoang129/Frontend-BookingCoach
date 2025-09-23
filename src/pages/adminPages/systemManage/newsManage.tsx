import { useState } from "react";
import BaseTable from "../../../components/ui/Table/Table";
import DeleteButton from "../../../components/ui/Button/Delete";
import EditButton from "../../../components/ui/Button/Edit";
import CreateButton from "../../../components/ui/Button/Create";
import { Dropdown } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import Pagination from "../../../components/ui/Pagination/Pagination";

import { useNews } from "../../../hooks/useNews.ts";
import NewsModals from "../../../containers/ModalsCollect/NewsModals";

export default function NewManage() {
  const {
    newsList,
    loading,
    selectedNews,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    handleCreateSubmit,
    handleEditSubmit,
    handleDelete,
    handleGetById,
  } = useNews();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredNews = newsList.filter((n) => {
    const status = n.status?.toLowerCase();
    const type = n.newsType;
    return (
      (statusFilter ? status === statusFilter.toLowerCase() : true) &&
      (typeFilter ? type === typeFilter : true)
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  const statusMenu = {
    items: [
      { key: "", label: "Tất cả" },
      { key: "Draft", label: "Bản nháp" },
      { key: "Published", label: "Đã xuất bản" },
    ],
    onClick: (e: any) => setStatusFilter(e.key),
  };

  const typeMenu = {
    items: [
      { key: "", label: "Tất cả" },
      { key: "News", label: "Tin tức" },
      { key: "Featured", label: "Tin nổi bật" },
      { key: "Recruitment", label: "Tin tuyển dụng" },
      { key: "Service", label: "Tin dịch vụ" },
    ],
    onClick: (e: any) => setTypeFilter(e.key),
  };

  return (
    <div className="panel-news-admin">
      <h2>Quản Lý Tin Tức</h2>
      <CreateButton onClick={() => setOpenCreate(true)}>
        + Thêm mới Tin tức
      </CreateButton>

      <BaseTable>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>
              Trạng thái{" "}
              <Dropdown menu={statusMenu} trigger={["click"]}>
                <FilterOutlined
                  style={{
                    cursor: "pointer",
                    color: statusFilter ? "#FFFF99" : "inherit",
                  }}
                />
              </Dropdown>
            </th>
            <th>
              Loại Tin{" "}
              <Dropdown menu={typeMenu} trigger={["click"]}>
                <FilterOutlined
                  style={{
                    cursor: "pointer",
                    color: typeFilter ? "#FFFF99" : "inherit",
                  }}
                />
              </Dropdown>
            </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Đang tải...
              </td>
            </tr>
          ) : currentNews.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Không có tin tức
              </td>
            </tr>
          ) : (
            currentNews.map((news) => (
              <tr key={news.id}>
                <td>
                  {news.thumbnail ? (
                    <img src={news.thumbnail} alt={news.title} width={80} />
                  ) : (
                    "—"
                  )}
                </td>
                <td>{news.title}</td>
                <td>
                  {news.author
                    ? `${news.author.firstName} ${news.author.lastName}`
                    : "—"}
                </td>
                <td>{news.status}</td>
                <td>{news.newsType}</td>
                <td>
                  <EditButton
                    onClick={() =>
                      handleGetById(news.id, () => setOpenEdit(true))
                    }
                  >
                    Sửa
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(news.id)}>
                    Xoá
                  </DeleteButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </BaseTable>

      {/* Modals */}
      <NewsModals
        openCreate={openCreate}
        setOpenCreate={setOpenCreate}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        selectedNews={selectedNews}
        handlers={{
          handleCreate: handleCreateSubmit,
          handleEdit: handleEditSubmit,
        }}
      />

      <Pagination
        totalItems={filteredNews.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
