// NewsPage.tsx
import { useEffect, useState } from "react";
import { getAllNews } from "../../services/systemServices/newServices.ts";
import { formatDate } from "../../utils/formatDate";
import "./newsPage.scss";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { slugify } from "../../utils/slugify";

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

interface NewsDetail {
  blockType: "text" | "image";
  content?: string;
  imageUrl?: string;
}

interface News {
  id: number;
  title: string;
  thumbnail: string;
  createdAt: string;
  newsType: string;
  author: Author;
  details?: NewsDetail[];
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllNews();
      if (res && res.data && Array.isArray(res.data.data)) {
        console.log("=== NEWS LIST RAW ===", res.data.data);
        res.data.data.forEach((n: News) => {
          console.log("👉 One news:", {
            id: n.id,
            title: n.title,
            firstBlock: n.details?.[0],
          });
        });

        setNewsList(res.data.data);
      }
    };
    fetchData();
  }, []);

  const newsItems = newsList.filter((n) => n.newsType === "News");
  const featureItems = newsList.filter((n) => n.newsType === "Featured");

  const topNews = newsItems.slice(0, 2);
  const topFeatures = featureItems.slice(0, 3);

  return (
    <div className="news-page">
      <div className="news-title-page">Tin tức</div>
      {newsList.length === 0 ? (
        <p className="no-news">Không có tin tức</p>
      ) : (
        <>
          <div className="top-news">
            <div className="left-news">
              {topNews.map((item) => (
                <div key={item.id} className="news-card">
                  <Link to={`/news/${item.id}/${slugify(item.title)}`}>
                    <img src={item.thumbnail} alt={item.title} />
                    <h3>{item.title}</h3>
                    <p className="time">{formatDate(item.createdAt)}</p>
                    <div className="content-preview">
                      {item.details && item.details[0]?.blockType === "text" ? (
                        <ReactMarkdown>
                          {item.details[0].content || ""}
                        </ReactMarkdown>
                      ) : (
                        ""
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>

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
          <div className="bottom-news">
            {newsItems.map((item) => (
              <div key={item.id} className="bottom-card">
                <Link to={`/news/${item.id}/${slugify(item.title)}`}>
                  <img src={item.thumbnail} alt={item.title} />
                  <h4>{item.title}</h4>
                </Link>
                <span className="time">{formatDate(item.createdAt)}</span>
                <div className="content-preview">
                  {item.details && item.details[0]?.blockType === "text" ? (
                    <ReactMarkdown>
                      {item.details[0].content || ""}
                    </ReactMarkdown>
                  ) : (
                    ""
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
