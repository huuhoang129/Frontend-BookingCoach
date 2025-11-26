// src/pages/clientPages/NewsDetailPage.tsx
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Spin } from "antd";
import "./NewsDetailPage.scss";

import { useNewsDetail } from "../../hooks/ClientHooks/useNewsDetailClient.ts";
import { formatDate } from "../../utils/formatDate";

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { news, loading } = useNewsDetail(id);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
              <a href="#">TP Thanh Hóa - Hà Nội</a>
            </li>
            <li>
              <a href="#">Hà Nội - TP Thanh Hóa</a>
            </li>
            <li>
              <a href="#">Triệu Sơn - Hà Nội</a>
            </li>
            <li>
              <a href="#">Hà Nội - Triệu Sơn</a>
            </li>
            <li>
              <a href="#">Sầm Sơn - BX Nước Ngầm</a>
            </li>
            <li>
              <a href="#">BX Nước Ngầm - Sầm Sơn</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
