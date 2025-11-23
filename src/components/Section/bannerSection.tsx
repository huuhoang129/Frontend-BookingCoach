import { useEffect, useState } from "react";
import { getAllBanners } from "../../services/systemServices/bannerServices.ts";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "../styles/Section/bannerSection.scss";
import defaultBanner from "../../assets/banner/banner.jpg";

type Banner = {
  id: number;
  image: string;
  title: string;
};

export default function BannerSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getAllBanners();
      const data: Banner[] = res.data.data || [];

      const mapped = data.map((b) => ({
        ...b,
        image: `data:image/png;base64,${b.image}`,
      }));

      // Đảo ngược thứ tự (banner mới lên đầu)
      setBanners(mapped.reverse());
    } catch (err) {
      console.error("❌ Lỗi khi lấy banners:", err);
    } finally {
      setLoading(false);
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  // 🕒 Tự động chạy vô hạn mỗi 5 giây
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (loading) return <div>Đang tải banner...</div>;

  if (banners.length === 0) {
    return (
      <section className="banner-section">
        <div className="banner-wrapper">
          <div className="banner-item">
            <img src={defaultBanner} alt="Banner mặc định" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="banner-section">
      <div className="banner-wrapper">
        <div
          className="banner-slider"
          style={{
            display: "flex",
            transition: "transform 0.8s ease-in-out",
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {banners.map((b) => (
            <div className="banner-item" key={b.id}>
              <img src={b.image} alt={b.title} />
            </div>
          ))}
        </div>

        {/* Nút điều hướng */}
        <button className="nav-btn left" onClick={prevSlide}>
          <LeftOutlined />
        </button>
        <button className="nav-btn right" onClick={nextSlide}>
          <RightOutlined />
        </button>
      </div>
    </section>
  );
}
