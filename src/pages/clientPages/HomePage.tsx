import BannerSection from "../../components/Section/bannerSection";
import FormInputSearchCoach from "../../components/ui/Form/FormInputSearchCoach";
import IntroduceSection from "../../components/Section/introduceSection";
import "./homePage.scss";

export default function HomePage() {
  return (
    <div className="homepage">
      <div className="banner-wrapper">
        <BannerSection />
        <div className="search-box">
          <FormInputSearchCoach />
        </div>
      </div>

      <IntroduceSection />
      <h1>Client - Trang chủ</h1>
    </div>
  );
}
