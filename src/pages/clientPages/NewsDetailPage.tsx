import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Spin } from "antd";
import { getNewsById } from "../../services/systemServices/newServices.ts";
import { formatDate } from "../../utils/formatDate";
import "./NewsDetailPage.scss";

interface Block {
  id: number;
  blockType: "text" | "image";
  content?: string;
  imageUrl?: string;
}

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

interface News {
  id: number;
  title: string;
  thumbnail: string;
  createdAt: string;
  author: Author;
  details: Block[];
}

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const res = await getNewsById(Number(id));
        if (res.data.errCode === 0) {
          setNews(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching news detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <Spin size="large" />
      </div>
    );
  }

  if (!news) {
    return <div className="no-content">Không tìm thấy tin tức.</div>;
  }

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
              const imageSrc = `${BASE_URL}/upload/${block.imageUrl}`;
              return (
                <div key={block.id} className="news-detail__block">
                  <img src={imageSrc} alt="news" />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

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
