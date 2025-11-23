// src/services/userServices/userService.ts
import requestAPI from "../../api/requestAPI";

// Lấy tất cả người dùng
const getAllUsers = () => {
  return requestAPI.get("/get-all-user");
};

// Tạo người dùng mới
const createUser = (data: any) => {
  return requestAPI.post("/create-user", data);
};

// Sửa thông tin người dùng
const editUser = (data: any) => {
  return requestAPI.put("/edit-user", data);
};

// Xoá người dùng
const deleteUser = (id: number) => {
  return requestAPI.delete("/delete-user", {
    data: { id },
  });
};

export { getAllUsers, createUser, editUser, deleteUser };
