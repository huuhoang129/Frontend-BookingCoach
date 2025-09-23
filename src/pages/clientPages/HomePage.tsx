import BannerSection from "../../components/Section/bannerSection";
import FormInputSearchCoach from "../../components/ui/Form/FormInputSearchCoach";
import IntroduceSection from "../../components/Section/introduceSection";
import NewSection from "../../components/Section/newSection";
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
      <NewSection />
    </div>
  );
}
