import BannerSection from "../../components/Section/bannerSection";
import FormInputSearchCoach from "../../components/ui/Form/FormInputSearchCoach";
import IntroduceSection from "../../components/Section/introduceSection";
import "./homePage.scss";

export default function HomePage() {
  return (
    <div className="homepage">
      <div className="banner-wrapper">
        <BannerSection />
        <div className="search-box-coach">
          <FormInputSearchCoach />
        </div>
      </div>

      <IntroduceSection />
      <div>
        <h2>Lộ trình phổ biến</h2>
        <h2>Tin nổi bật</h2>
        <h2>Dịch vụ nổi bật</h2>
        <h2>Tin tức cập nhật</h2>
      </div>
    </div>
  );
}
