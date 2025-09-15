import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/layout/Topbar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

interface HomeTemplateProps {
  Component?: React.ComponentType<any>;
}

export const HomeTemplate: React.FC<HomeTemplateProps> = ({ Component }) => {
  return (
    <Fragment>
      <TopBar />
      <Header />
      {Component ? <Component /> : <Outlet />}
      <Footer />
    </Fragment>
  );
};

export default HomeTemplate;
