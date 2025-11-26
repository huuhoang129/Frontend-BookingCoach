//src/templates/clientTemplates.tsx
import { Outlet } from "react-router-dom";
import TopBar from "../components/layout/Topbar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "./clientTemplates.scss";

interface HomeTemplateProps {
  Component?: React.ComponentType<any>;
}

export const HomeTemplate: React.FC<HomeTemplateProps> = ({ Component }) => {
  return (
    // Template giao diện
    <div className="home-template">
      <TopBar />
      <Header />

      {/* Nội dung chính */}
      <div className="home-content">
        {Component ? <Component /> : <Outlet />}
      </div>

      <Footer />
    </div>
  );
};

export default HomeTemplate;
