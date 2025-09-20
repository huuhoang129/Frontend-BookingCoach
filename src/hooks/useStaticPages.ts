// hooks/useStaticPages.ts
import { useEffect, useState } from "react";
import {
  getAboutPage,
  updateAboutPage,
  getConditionsPage,
  updateConditionsPage,
  getPrivacyPolicyPage,
  updatePrivacyPolicyPage,
  getRefundPolicyPage,
  updateRefundPolicyPage,
  getPaymentPolicyPage,
  updatePaymentPolicyPage,
  getCancellationPolicyPage,
  updateCancellationPolicyPage,
  getShippingPolicyPage,
  updateShippingPolicyPage,
} from "../services/systemServices/staticPageServices.ts";

export type TabKey =
  | "about"
  | "terms"
  | "privacy_policy"
  | "refund_policy"
  | "payment_policy"
  | "cancellation_policy"
  | "shipping_policy";

export interface ContentData {
  title: string;
  content: string;
}

const pageConfig: Record<
  TabKey,
  {
    title: string;
    getApi: () => Promise<any>;
    updateApi: (blocks: any[]) => Promise<any>;
  }
> = {
  about: {
    title: "Giới thiệu",
    getApi: getAboutPage,
    updateApi: updateAboutPage,
  },
  terms: {
    title: "Điều khoản",
    getApi: getConditionsPage,
    updateApi: updateConditionsPage,
  },
  privacy_policy: {
    title: "Chính sách Bảo mật",
    getApi: getPrivacyPolicyPage,
    updateApi: updatePrivacyPolicyPage,
  },
  refund_policy: {
    title: "Chính sách Hoàn tiền",
    getApi: getRefundPolicyPage,
    updateApi: updateRefundPolicyPage,
  },
  payment_policy: {
    title: "Chính sách Thanh toán",
    getApi: getPaymentPolicyPage,
    updateApi: updatePaymentPolicyPage,
  },
  cancellation_policy: {
    title: "Chính sách Hoàn huỷ",
    getApi: getCancellationPolicyPage,
    updateApi: updateCancellationPolicyPage,
  },
  shipping_policy: {
    title: "Chính sách Vận chuyển",
    getApi: getShippingPolicyPage,
    updateApi: updateShippingPolicyPage,
  },
};

export function useStaticPages() {
  const [mode, setMode] = useState<Record<TabKey, "edit" | "preview">>(
    Object.keys(pageConfig).reduce(
      (acc, key) => ({ ...acc, [key]: "edit" }),
      {} as Record<TabKey, "edit" | "preview">
    )
  );

  const [savedContent, setSavedContent] = useState<Record<TabKey, ContentData>>(
    Object.keys(pageConfig).reduce(
      (acc, key) => ({ ...acc, [key]: { title: "", content: "" } }),
      {} as Record<TabKey, ContentData>
    )
  );

  // --- Fetch data ---
  useEffect(() => {
    const fetchData = async (key: TabKey) => {
      try {
        const res = await pageConfig[key].getApi();
        if (res.data.errCode === 0 && res.data.data.length > 0) {
          const content = res.data.data
            .map((b: any) =>
              b.blockType === "text"
                ? b.content
                : `![image](/upload/${b.imageUrl})`
            )
            .join("\n\n");

          setSavedContent((prev) => ({
            ...prev,
            [key]: { title: pageConfig[key].title, content },
          }));
          setMode((prev) => ({ ...prev, [key]: "preview" }));
        }
      } catch (err) {
        console.error(`❌ Load ${key} error:`, err);
      }
    };

    (async () => {
      for (const key of Object.keys(pageConfig) as TabKey[]) {
        await fetchData(key);
      }
    })();
  }, []);

  // --- Save data ---
  const handleSave = async (values: ContentData, key: TabKey) => {
    try {
      const lines = (values.content || "").split(/\r?\n+/);
      const blocks = lines
        .filter((line) => line.trim() !== "")
        .map((line, index) => {
          const imageMatch = line.match(/!\[.*?\]\((.*?)\)/);
          if (imageMatch) {
            const relativePath = imageMatch[1].split("/").pop();
            return {
              blockType: "image",
              imageUrl: relativePath,
              sortOrder: index + 1,
            };
          }
          return {
            blockType: "text",
            content: line,
            sortOrder: index + 1,
          };
        });

      await pageConfig[key].updateApi(blocks);

      setSavedContent((prev) => ({ ...prev, [key]: values }));
      setMode((prev) => ({ ...prev, [key]: "preview" }));
    } catch (err) {
      console.error(`❌ Update ${key} error:`, err);
    }
  };

  return { mode, setMode, savedContent, setSavedContent, handleSave };
}
