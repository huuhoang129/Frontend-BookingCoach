import { useEffect, useState } from "react";
import { getAllNews } from "../../services/systemServices/newServices.ts";
import "../styles/Section/serviceSection.scss";
import { Link } from "react-router-dom";
import { slugify } from "../../utils/slugify";
import ReactMarkdown from "react-markdown";

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

export default function ServiceSection() {
  const [serviceList, setServiceList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 4;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getAllNews();
        if (res && res.data && Array.isArray(res.data.data)) {
          const filtered = res.data.data
            .filter((n: News) => n.newsType === "Service")
            .sort(
              (a: News, b: News) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );

          setServiceList(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <p className="service-loading">Đang tải dịch vụ...</p>;
  }

  return (
    <section className="service-section">
      <div className="service-header">
        <h2 className="service-title">Dịch vụ nổi bật</h2>
      </div>
      <div className="service-container">
        <div className="service-viewport">
          <div
            className="service-slider"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {serviceList.map((service) => (
              <div key={service.id} className="service-card">
                <Link to={`/news/${service.id}/${slugify(service.title)}`}>
                  {service.thumbnail && (
                    <img
                      src={service.thumbnail}
                      alt={service.title}
                      className="service-thumbnail"
                    />
                  )}
                  <div className="service-content">
                    <h3 className="service-item-title">{service.title}</h3>
                    <p className="service-meta"></p>

                    <div className="content-preview">
                      {service.details &&
                      service.details[0]?.blockType === "text" ? (
                        <ReactMarkdown>
                          {service.details[0].content || ""}
                        </ReactMarkdown>
                      ) : (
                        ""
                      )}
                    </div>
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
