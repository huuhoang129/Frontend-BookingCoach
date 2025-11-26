// src/pages/clientPages/NewsDetailPage.tsx
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Spin } from "antd";
import "./NewsDetailPage.scss";
import dayjs from "dayjs";
import { useNewsDetail } from "../../hooks/ClientHooks/useNewsDetailClient.ts";
import { formatDate } from "../../utils/formatDate";

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { news, loading } = useNewsDetail(id);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");

  const buildBookingUrl = (fromId: number, toId: number) => {
    return `/booking?fromLocationId=${fromId}&toLocationId=${toId}&tripDateStart=${tomorrow}&roundTrip=one`;
  };
  if (loading)
    return (
      <div className="loading-wrapper">
        <Spin size="large" />
      </div>
    );

  if (!news) return <div className="no-content">Không tìm thấy tin tức.</div>;

  return (
    <div className="news-detail">
      <div className="news-detail__left">
        <h1 className="news-detail__title">{news.title}</h1>

        <p className="news-detail__date">
          {formatDate(news.createdAt, true)} - {news.author.firstName}{" "}
          {news.author.lastName}
        </p>

        <div className="news-detail__content">
          {news.details.map((block) => {
            if (block.blockType === "text" && block.content) {
              return (
                <div key={block.id} className="news-detail__block">
                  <ReactMarkdown>{block.content}</ReactMarkdown>
                </div>
              );
            }

            if (block.blockType === "image" && block.imageUrl) {
              return (
                <div key={block.id} className="news-detail__block">
                  <img
                    src={`${BASE_URL}/upload/${block.imageUrl}`}
                    alt={news.title}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      {/* Danh sách tuyến xe */}
      <div className="news-detail__right">
        <div className="routes-box">
          <h2 className="routes-box__title">Lộ Trình Xe</h2>
          <ul className="routes-box__list">
            <li>
              <Link to={buildBookingUrl(1, 4)}>BX Nước Ngầm → BX Bãi Cháy</Link>
            </li>
            <li>
              <Link to={buildBookingUrl(1, 6)}>
                BX Nước Ngầm → BX Niệm Nghĩa
              </Link>
            </li>
            <li>
              <Link to={buildBookingUrl(1, 8)}>BX Nước Ngầm → BX Nam Định</Link>
            </li>
            <li>
              <Link to={buildBookingUrl(1, 10)}>
                BX Nước Ngầm → BX Thái Bình
              </Link>
            </li>
            <li>
              <Link to={buildBookingUrl(14, 1)}>
                BX Thanh Hóa → BX Nước Ngầm
              </Link>
            </li>
            <li>
              <Link to={buildBookingUrl(14, 2)}>BX Thanh Hóa → Sư Phạm HN</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
