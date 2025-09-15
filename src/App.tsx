import { Routes, Route } from "react-router-dom";
import HomeTemplate from "./templates/clientTemplates";
import AdminTemplate from "./templates/adminTemplates";
import HomePage from "./pages/clientPages/HomePage";
import DashboardPage from "./pages/adminPages/DashboardPage";
import BannerManage from "./pages/adminPages/systemManage/bannerManage";
import UserManage from "./pages/adminPages/usersManage/userManage";

export default function App() {
  return (
    <Routes>
      {/* CLIENT */}
      <Route element={<HomeTemplate />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* ADMIN */}
      <Route
        element={<AdminTemplate Component={DashboardPage} />}
        path="/admin"
      />
      <Route
        element={<AdminTemplate Component={BannerManage} />}
        path="/admin/banner-manage"
      />
      <Route
        element={<AdminTemplate Component={UserManage} />}
        path="/admin/user-manage"
      />
    </Routes>
  );
}
