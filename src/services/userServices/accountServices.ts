// src/services/userServices/accountServices.ts
import requestAPI from "../../api/requestAPI";

// Lấy toàn bộ tài khoản
const getAllAccounts = () => {
  return requestAPI.get("/get-all-accounts");
};

// Khóa tài khoản
const lockAccount = (id: number) => {
  return requestAPI.put("/lock-account", { id });
};

// Mở khóa tài khoản
const unlockAccount = (id: number) => {
  return requestAPI.put("/unlock-account", { id });
};

export { getAllAccounts, lockAccount, unlockAccount };
