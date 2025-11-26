//src/pages/clientPages/HomePage.tsx
import BannerSection from "../../components/Section/bannerSection";
import FormInputSearchCoach from "../../components/ui/Form/FormInputSearchCoach";
import IntroduceSection from "../../components/Section/introduceSection";
import ServiceSection from "../../components/Section/servicesSection";
import NewSection from "../../components/Section/newSection";
import PopularRoutesSection from "../../components/Section/popularRoutesSection";
import "./homePage.scss";

export default function HomePage() {
  return (
    <div className="homepage">
      {/* Khu vực banner và ô tìm kiếm */}
      <div className="banner-wrapper">
        <BannerSection />
        {/* Ô tìm kiếm chuyến xe */}
        <div className="search-box-coach">
          <FormInputSearchCoach />
        </div>
      </div>
      <IntroduceSection />
      {/* Tuyến xe phổ biến */}
      <PopularRoutesSection />
      {/* Dịch vụ nổi bật */}
      <ServiceSection />
      {/* Tin tức mới */}
      <NewSection />
    </div>
  );
}
