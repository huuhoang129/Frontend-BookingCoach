// hooks/useAccounts.ts
import { useState, useEffect } from "react";
import {
  getAllAccounts,
  lockAccount,
  unlockAccount,
} from "../services/userServices/accountServices.ts";

export interface Account {
  id: number;
  email: string;
  role: string;
  status: string;
}

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await getAllAccounts();
      console.log("📦 [useAccounts] Data from API:", res.data.data);
      const users: Account[] = res.data.data || [];
      setAccounts(users);
    } catch (err) {
      console.error("❌ Lỗi khi fetch accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLock = async (id: number) => {
    try {
      await lockAccount(id);
      fetchAccounts();
    } catch (err) {
      console.error("❌ Lỗi khi khóa tài khoản:", err);
    }
  };

  const handleUnlock = async (id: number) => {
    try {
      await unlockAccount(id);
      fetchAccounts();
    } catch (err) {
      console.error("❌ Lỗi khi mở khóa tài khoản:", err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    fetchAccounts,
    handleLock,
    handleUnlock,
  };
}
