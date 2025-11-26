//src/components/staticPage/StaticPage.tsx
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
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

// Ánh xạ
const backendKeyMap: Record<string, string> = {
  about: "AboutPage",
  terms: "TermsPage",
  privacy_policy: "PrivacyPolicyPage",
  refund_policy: "RefundPolicyPage",
  payment_policy: "PaymentPolicyPage",
  cancellation_policy: "CancellationPolicyPage",
  shipping_policy: "ShippingPolicyPage",
};

// Danh sách lộ trình hiển thị cố định
const routeLinks = [
  { label: "TP Thanh Hóa → Hà Nội", from: 14, to: 1 },
  { label: "Hà Nội → TP Thanh Hóa", from: 1, to: 14 },

  { label: "Triệu Sơn → Hà Nội", from: 2, to: 1 },
  { label: "Hà Nội → Triệu Sơn", from: 1, to: 2 },

  { label: "Sầm Sơn → BX Nước Ngầm", from: 3, to: 1 },
  { label: "BX Nước Ngầm → Sầm Sơn", from: 1, to: 3 },
];

const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
const buildBookingUrl = (fromId: number, toId: number) => {
  return `/booking?fromLocationId=${fromId}&toLocationId=${toId}&tripDateStart=${tomorrow}&roundTrip=one`;
};

export default function StaticPage({ pageKey, title }: StaticPageProps) {
  // Lưu danh sách block nội dung
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [createdAt, setCreatedAt] = useState<string>("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // Lấy dữ liệu
    const fetchData = async () => {
      try {
        const backendKey = backendKeyMap[pageKey] || pageKey;
        const res = await getStaticPage(backendKey);

        if (res.data.errCode === 0) {
          const data: Block[] = res.data.data;
          setBlocks(data);
          // Lấy ngày tạo
          if (data.length > 0 && data[0].createdAt) {
            setCreatedAt(data[0].createdAt);
          }
        }
      } catch (err) {
        console.error("Lỗi tải nội dung trang tĩnh:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageKey]);

  // Hiển thị trạng thái
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
      {/* Cột nội dung chính */}
      <div className="static-page__left">
        <h1 className="static-page__title">{title}</h1>
        {/* Hiển thị ngày tạo */}
        {createdAt && (
          <p className="static-page__date">{formatDate(createdAt, true)}</p>
        )}
        {/* Hiển thị danh sách block */}
        <div className="static-page__content">
          {blocks.map((block) => {
            // Render nội dung dạng text
            if (block.blockType === "text" && block.content) {
              return (
                <div key={block.id} className="static-page__block">
                  <ReactMarkdown>{block.content}</ReactMarkdown>
                </div>
              );
            }
            // Render nội dung dạng hình ảnh
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
      {/* Cột lộ trình */}
      <div className="static-page__right">
        <div className="routes-box">
          <h2 className="routes-box__title">Lộ Trình Xe</h2>

          <ul className="routes-box__list">
            {routeLinks.map((route, idx) => (
              <li key={idx}>
                <Link to={buildBookingUrl(route.from, route.to)}>
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
