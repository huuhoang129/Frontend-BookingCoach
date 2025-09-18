import BannerSection from "../../components/Section/bannerSection";
import FormInputSearchCoach from "../../components/ui/Form/FormInputSearchCoach";

export default function HomePage() {
  return (
    <div className="homepage">
      <BannerSection />
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <FormInputSearchCoach />
      </div>
      <h1>Client - Trang chủ</h1>
    </div>
  );
}
