import { useEffect, useState } from "react";
import { getAllNews } from "../../services/systemServices/newServices.ts";
import { formatDate } from "../../utils/formatDate";
import "../styles/Section/newSection.scss";
import { Link } from "react-router-dom";
import { slugify } from "../../utils/slugify";

import LeftIcon from "../../assets/icon/left-2.svg";
import RightIcon from "../../assets/icon/right.svg";

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
  newsType: string;
  author: Author;
}

export default function NewsSection() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 4;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getAllNews();
        if (res && res.data && Array.isArray(res.data.data)) {
          const filtered = res.data.data
            .filter((n: News) => n.newsType === "News")
            .sort(
              (a: News, b: News) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );

          setNewsList(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p className="news-loading">Đang tải tin tức...</p>;
  }

  const maxIndex = Math.max(newsList.length - itemsPerPage, 0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="news-section">
      <div className="news-header">
        <h2 className="news-title">Tin tức cập nhật</h2>
        <Link to="/news" className="news-view-all">
          <span>Xem tất cả</span>
          <img src={RightIcon} alt="view-all" />
        </Link>
      </div>
      <div className="news-container">
        <div className="arrow arrow-left" onClick={handlePrev}>
          <img src={LeftIcon} alt="left" />
        </div>
        <div className="arrow arrow-right" onClick={handleNext}>
          <img src={RightIcon} alt="right" />
        </div>

        <div className="news-viewport">
          <div
            className="news-slider"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {newsList.map((news) => (
              <div key={news.id} className="news-card">
                <Link to={`/news/${news.id}/${slugify(news.title)}`}>
                  {news.thumbnail && (
                    <img
                      src={news.thumbnail}
                      alt={news.title}
                      className="news-thumbnail"
                    />
                  )}
                  <div className="news-content">
                    <h3 className="news-item-title">{news.title}</h3>
                    <p className="news-meta">
                      {formatDate(news.createdAt)} |{" "}
                      {news.author
                        ? `${news.author.firstName} ${news.author.lastName}`
                        : "Ẩn danh"}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
