// src/pages/clientPages/newsPage.tsx
import "./newsPage.scss";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { useNews } from "../../hooks/ClientHooks/useNewsClient.ts";
import { slugify } from "../../utils/slugify";
import { formatDate } from "../../utils/formatDate";

export default function NewsPage() {
  const { newsList, loading, newsItems, topNews, topFeatures } = useNews();

  if (loading) return <p className="loading">Đang tải...</p>;

  return (
    <div className="news-page">
      <div className="news-title-page">Tin tức</div>

      {newsList.length === 0 ? (
        <p className="no-news">Không có tin tức</p>
      ) : (
        <>
          {/* Khu vực tin nổi bật */}
          <div className="top-news">
            <div className="left-news">
              {topNews.map((item) => (
                <div key={item.id} className="news-card">
                  <Link to={`/news/${item.id}/${slugify(item.title)}`}>
                    <img src={item.thumbnail} alt={item.title} />
                    <h3>{item.title}</h3>
                    <p className="time">{formatDate(item.createdAt)}</p>

                    <div className="content-preview">
                      {item.details?.[0]?.blockType === "text" && (
                        <ReactMarkdown>
                          {item.details[0].content || ""}
                        </ReactMarkdown>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Tin nổi bật */}
            <div className="right-feature">
              {topFeatures.map((item) => (
                <div key={item.id} className="feature-card">
                  <Link to={`/news/${item.id}/${slugify(item.title)}`}>
                    <img src={item.thumbnail} alt={item.title} />
                    <div className="feature-info">
                      <p>{item.title}</p>
                      <span className="time">{formatDate(item.createdAt)}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <hr className="divider" />

          {/* Danh sách tin bên dưới */}
          <div className="bottom-news">
            {newsItems.map((item) => (
              <div key={item.id} className="bottom-card">
                <Link to={`/news/${item.id}/${slugify(item.title)}`}>
                  <img src={item.thumbnail} alt={item.title} />
                  <h4>{item.title}</h4>
                </Link>

                <span className="time">{formatDate(item.createdAt)}</span>

                <div className="content-preview">
                  {item.details?.[0]?.blockType === "text" && (
                    <ReactMarkdown>
                      {item.details[0].content || ""}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
