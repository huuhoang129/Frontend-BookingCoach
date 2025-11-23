//src/hooks/userHooks/useAccountsManage.ts
import { useState, useEffect } from "react";
import {
  getAllAccounts,
  lockAccount,
  unlockAccount,
} from "../../services/userServices/accountServices.ts";
import { AppNotification } from "../../components/Notification/AppNotification.tsx";

export interface Account {
  id: number;
  email: string;
  role: string;
  status: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const { contextHolder, notifySuccess, notifyError } = AppNotification();

  // fetch danh sách tài khoản
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await getAllAccounts();
      if (res.data.errCode === 0) {
        setAccounts(res.data.data || []);
      } else {
        notifyError("Không thể tải danh sách", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể tải danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // khóa tài khoản
  const handleLock = async (id: number) => {
    try {
      const res = await lockAccount(id);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        fetchAccounts();
      } else {
        notifyError("Không thể khóa tài khoản", res.data.errMessage);
      }
    } catch {
      notifyError(
        "Lỗi hệ thống",
        "Không thể khóa tài khoản, vui lòng thử lại."
      );
    }
  };

  // mở khóa tài khoản
  const handleUnlock = async (id: number) => {
    try {
      const res = await unlockAccount(id);
      if (res.data.errCode === 0) {
        notifySuccess("Thành công", res.data.errMessage);
        fetchAccounts();
      } else {
        notifyError("Không thể mở khóa tài khoản", res.data.errMessage);
      }
    } catch {
      notifyError("Lỗi hệ thống", "Không thể mở khóa tài khoản.");
    }
  };

  return {
    accounts,
    loading,
    fetchAccounts,
    handleLock,
    handleUnlock,
    contextHolder,
  };
}
