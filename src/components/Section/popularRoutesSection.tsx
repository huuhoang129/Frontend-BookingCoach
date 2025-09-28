import { useEffect, useState } from "react";
import { getAllRoutes } from "../../services/stationServices/routesServices.ts";
import { Link } from "react-router-dom";
import "../styles/Section/popularRoutes.scss";
import { CalendarOutlined } from "@ant-design/icons";

import LeftIcon from "../../assets/icon/left-2.svg";
import RightIcon from "../../assets/icon/right.svg";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

interface Province {
  id: number;
  nameProvince: string;
}

interface Location {
  id: number;
  nameLocations: string;
  province?: Province;
}

interface Route {
  id: number;
  fromLocation: Location;
  toLocation: Location;
  imageRouteCoach?: string;
}

function RouteSlider({ title, routes }: { title: string; routes: Route[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const maxIndex = Math.max(routes.length - itemsPerPage, 0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <div className="popular-block">
      <div className="popular-header">
        <h3 className="popular-title">{title}</h3>
      </div>

      {routes.length === 0 ? (
        <p className="popular-empty">Chưa có lộ trình</p>
      ) : (
        <div className="popular-container">
          <div className="arrow arrow-left" onClick={handlePrev}>
            <img src={LeftIcon} alt="left" />
          </div>
          <div className="arrow arrow-right" onClick={handleNext}>
            <img src={RightIcon} alt="right" />
          </div>

          <div className="popular-viewport">
            <div
              className="popular-slider"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerPage)
                }%)`,
              }}
            >
              {routes.map((route) => {
                const [date, setDate] = useState<Dayjs | null>(
                  dayjs().add(1, "day")
                );

                return (
                  <div key={route.id} className="popular-card">
                    <div>
                      {route.imageRouteCoach ? (
                        <img
                          src={route.imageRouteCoach}
                          alt={`${route.fromLocation?.nameLocations} - ${route.toLocation?.nameLocations}`}
                          className="popular-thumbnail"
                        />
                      ) : (
                        <div className="popular-placeholder">No Image</div>
                      )}
                      <div className="popular-content">
                        <h4 className="popular-item-title">
                          {route.fromLocation?.nameLocations} →{" "}
                          {route.toLocation?.nameLocations}
                        </h4>
                      </div>
                    </div>

                    <div className="popular-date">
                      <span className="popular-date__label">Ngày đi</span>
                      <DatePicker
                        value={date}
                        onChange={(d) => setDate(d)}
                        format="DD/MM/YYYY"
                        className="popular-date__input"
                        allowClear={false}
                        suffixIcon={
                          <CalendarOutlined
                            style={{ color: "#4d940e", fontSize: 18 }}
                          />
                        }
                      />
                    </div>

                    <Link
                      to={`/booking?fromLocationId=${
                        route.fromLocation?.id
                      }&toLocationId=${
                        route.toLocation?.id
                      }&tripDateStart=${date?.format(
                        "YYYY-MM-DD"
                      )}&roundTrip=one`}
                      className="popular-btn"
                    >
                      Đặt xe ngay
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PopularRoutesSection() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await getAllRoutes();
        if (res && res.data && Array.isArray(res.data.data)) {
          console.log("✅ Routes fetched:", res.data.data);
          setRoutes(res.data.data);
        }
      } catch (err) {
        console.error("❌ Lỗi fetch routes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (loading) {
    return <p className="popular-loading">Đang tải lộ trình...</p>;
  }

  const fromHaNoi = routes.filter(
    (r) => r.fromLocation?.province?.nameProvince === "Hà Nội"
  );

  const fromThanhHoa = routes.filter(
    (r) => r.fromLocation?.province?.nameProvince === "Thanh Hóa"
  );

  return (
    <section className="popular-section">
      <h2 className="section-title">Lộ trình phổ biến</h2>
      <RouteSlider title="Từ Hà Nội đi" routes={fromHaNoi} />
      <RouteSlider title="Từ Thanh Hóa đi" routes={fromThanhHoa} />
    </section>
  );
}
