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
    <div className="home-template">
      <TopBar />
      <Header />
      <div className="home-content">
        {Component ? <Component /> : <Outlet />}
      </div>
      <Footer />
    </div>
  );
};

export default HomeTemplate;
