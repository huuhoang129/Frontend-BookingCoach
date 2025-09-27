import BaseTable from "../../../components/ui/Table/Table";
import CreateButton from "../../../components/ui/Button/Create";
import DeleteButton from "../../../components/ui/Button/Delete";
import EditButton from "../../../components/ui/Button/Edit";
import PaginationComponent from "../../../components/ui/Pagination/Pagination";

import { useRoute } from "../../../hooks/useRoute.ts";
import { RouteModal } from "../../../containers/ModalsCollect/RouteModal";

export default function RouteManager() {
  const {
    routes,
    paginatedRoutes,
    open,
    setOpen,
    editingRoute,
    setEditingRoute,
    setFromProvinceId,
    form,
    currentPage,
    setCurrentPage,
    pageSize,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    fromOptions,
    toOptions,
  } = useRoute();

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý tuyến đường</h2>

      <CreateButton
        onClick={() => {
          setOpen(true);
          setEditingRoute(null);
        }}
      >
        Thêm tuyến
      </CreateButton>

      {/* Modal dùng chung cho Create + Edit */}
      <RouteModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingRoute(null);
          setFromProvinceId(null);
        }}
        onSubmit={editingRoute ? handleUpdate : handleCreate}
        fromOptions={fromOptions}
        toOptions={toOptions}
        setFromProvinceId={setFromProvinceId}
        form={form}
        mode={editingRoute ? "edit" : "create"}
        editingRoute={editingRoute}
      />

      <BaseTable>
        <thead>
          <tr>
            <th style={{ width: "80px" }}>ID</th>
            <th style={{ width: "100px" }}>Ảnh</th>
            <th>Tuyến</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {routes.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            paginatedRoutes.map((r, index) => (
              <tr key={r.id}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                <td>
                  {r.imageRouteCoach && (
                    <img
                      src={
                        r.imageRouteCoach.startsWith("data:image")
                          ? r.imageRouteCoach
                          : `data:image/png;base64,${r.imageRouteCoach}`
                      }
                      alt="route"
                      style={{ width: 100, height: 60, objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>
                  {r.fromLocation?.nameLocations} (
                  {r.fromLocation?.province?.nameProvince}) →{" "}
                  {r.toLocation?.nameLocations} (
                  {r.toLocation?.province?.nameProvince})
                </td>
                <td>
                  <EditButton onClick={() => handleEdit(r)} />{" "}
                  <DeleteButton onClick={() => handleDelete(r.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </BaseTable>

      <PaginationComponent
        totalItems={routes.length}
        itemsPerPage={pageSize}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
