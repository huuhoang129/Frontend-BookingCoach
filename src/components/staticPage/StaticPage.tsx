import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Spin } from "antd";
import { getStaticPage } from "../../services/systemServices/staticPageServices.ts";
import { formatDate } from "../../utils/formatDate";
import "../styles/staticPage/staticPage.scss";

interface Block {
  id: number;
  blockType: "text" | "image";
  content?: string;
  imageUrl?: string;
  url?: string;
  createdAt?: string;
}

interface StaticPageProps {
  pageKey: string;
  title: string;
}

const backendKeyMap: Record<string, string> = {
  about: "AboutPage",
  terms: "TermsPage",
  privacy_policy: "PrivacyPolicyPage",
  refund_policy: "RefundPolicyPage",
  payment_policy: "PaymentPolicyPage",
  cancellation_policy: "CancellationPolicyPage",
  shipping_policy: "ShippingPolicyPage",
};

const dummyRoutes = [
  "TP Thanh Hóa - Hà Nội",
  "Hà Nội - TP Thanh Hóa",
  "Triệu Sơn - Hà Nội",
  "Hà Nội - Triệu Sơn",
  "Sầm Sơn - BX Nước Ngầm",
  "BX Nước Ngầm - Sầm Sơn",
];

export default function StaticPage({ pageKey, title }: StaticPageProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [createdAt, setCreatedAt] = useState<string>("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendKey = backendKeyMap[pageKey] || pageKey;
        const res = await getStaticPage(backendKey);
        if (res.data.errCode === 0) {
          const data: Block[] = res.data.data;
          setBlocks(data);

          // 👇 lấy createdAt của block đầu tiên
          if (data.length > 0 && data[0].createdAt) {
            setCreatedAt(data[0].createdAt);
          }
        }
      } catch (err) {
        console.error("Error fetching static page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageKey]);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <Spin size="large" />
      </div>
    );
  }

  if (!blocks || blocks.length === 0) {
    return <div className="no-content">Không có nội dung cho trang này.</div>;
  }

  return (
    <div className="static-page">
      <div className="static-page__left">
        <h1 className="static-page__title">{title}</h1>

        {createdAt && (
          <p className="static-page__date">{formatDate(createdAt, true)}</p>
        )}

        <div className="static-page__content">
          {blocks.map((block) => {
            if (block.blockType === "text" && block.content) {
              return (
                <div key={block.id} className="static-page__block">
                  <ReactMarkdown>{block.content}</ReactMarkdown>
                </div>
              );
            }
            if (block.blockType === "image" && block.imageUrl) {
              const imageSrc = `${BASE_URL}/upload/${block.imageUrl}`;
              return (
                <div key={block.id} className="static-page__block">
                  <img src={imageSrc} alt="static" />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="static-page__right">
        <div className="routes-box">
          <h2 className="routes-box__title">Lộ Trình Xe</h2>
          <ul className="routes-box__list">
            {dummyRoutes.map((route, idx) => (
              <li key={idx}>
                <a href="#">{route}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
