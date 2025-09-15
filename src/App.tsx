import { Routes, Route } from "react-router-dom";
import HomeTemplate from "./templates/clientTemplates";
import AdminRoute from "./routes/AdminRoute";

// client pages
import HomePage from "./pages/clientPages/HomePage";

// admin pages
import DashboardPage from "./pages/adminPages/DashboardPage";
import BannerManage from "./pages/adminPages/systemManage/bannerManage";
import UserManage from "./pages/adminPages/usersManage/userManage";

export default function App() {
  return (
    <Routes>
      {/* Client */}
      <Route element={<HomeTemplate />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* Admin (bọc qua AdminRoute) */}
      <Route
        path="/admin"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={DashboardPage} />
        }
      />
      <Route
        path="/admin/banner-manage"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={BannerManage} />
        }
      />
      <Route
        path="/admin/user-manage"
        element={<AdminRoute allowedRoles={["Admin"]} Component={UserManage} />}
      />
    </Routes>
  );
}
