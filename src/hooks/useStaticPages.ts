import { useEffect, useState } from "react";
import {
  getStaticPage,
  updateStaticPage,
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

const backendKeyMap: Record<TabKey, string> = {
  about: "AboutPage",
  terms: "TermsPage",
  privacy_policy: "PrivacyPolicyPage",
  refund_policy: "RefundPolicyPage",
  payment_policy: "PaymentPolicyPage",
  cancellation_policy: "CancellationPolicyPage",
  shipping_policy: "ShippingPolicyPage",
};

const titleMap: Record<TabKey, string> = {
  about: "Giới thiệu",
  terms: "Điều khoản",
  privacy_policy: "Chính sách Bảo mật",
  refund_policy: "Chính sách Hoàn tiền",
  payment_policy: "Chính sách Thanh toán",
  cancellation_policy: "Chính sách Hoàn huỷ",
  shipping_policy: "Chính sách Vận chuyển",
};

export function useStaticPages() {
  const [mode, setMode] = useState<Record<TabKey, "edit" | "preview">>(
    Object.keys(titleMap).reduce(
      (acc, key) => ({ ...acc, [key]: "edit" }),
      {} as Record<TabKey, "edit" | "preview">
    )
  );

  const [savedContent, setSavedContent] = useState<Record<TabKey, ContentData>>(
    Object.keys(titleMap).reduce(
      (acc, key) => ({ ...acc, [key]: { title: "", content: "" } }),
      {} as Record<TabKey, ContentData>
    )
  );

  useEffect(() => {
    const fetchData = async (key: TabKey) => {
      try {
        const res = await getStaticPage(backendKeyMap[key]);
        const result = res.data;

        if (result.errCode === 0 && result.data && result.data.length > 0) {
          const blocks = result.data;
          const content = blocks
            .map((b: any) =>
              b.blockType === "text"
                ? b.content
                : `![image](/upload/${b.imageUrl})`
            )
            .join("\n\n");

          setSavedContent((prev) => ({
            ...prev,
            [key]: { title: titleMap[key], content },
          }));
          setMode((prev) => ({ ...prev, [key]: "preview" }));
        }
      } catch (err) {
        console.error(`❌ Load ${key} error:`, err);
      }
    };

    (async () => {
      for (const key of Object.keys(titleMap) as TabKey[]) {
        await fetchData(key);
      }
    })();
  }, []);

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

      await updateStaticPage(backendKeyMap[key], blocks);

      setSavedContent((prev) => ({ ...prev, [key]: values }));
      setMode((prev) => ({ ...prev, [key]: "preview" }));
    } catch (err) {
      console.error(`❌ Update ${key} error:`, err);
    }
  };

  return { mode, setMode, savedContent, setSavedContent, handleSave };
}
