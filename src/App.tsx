import { Routes, Route } from "react-router-dom";
import HomeTemplate from "./templates/clientTemplates";
import AdminRoute from "./routes/AdminRoute";

// client pages
import HomePage from "./pages/clientPages/HomePage";

// admin pages
import DashboardPage from "./pages/adminPages/DashboardPage";
import BannerManage from "./pages/adminPages/systemManage/bannerManage";
import HomepageManage from "./pages/adminPages/systemManage/homePageManage";
import UserManage from "./pages/adminPages/usersManage/userManage";
import EmployeeManage from "./pages/adminPages/usersManage/employeeManage";
import AccountManage from "./pages/adminPages/usersManage/accountManage";
import ContactPage from "./pages/clientPages/contactPage";

export default function App() {
  return (
    <Routes>
      {/* Client */}
      <Route element={<HomeTemplate />}>
        <Route index element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin (bọc qua AdminRoute) */}
      <Route
        path="/admin"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={DashboardPage} />
        }
      />

      {/* systemManage */}
      <Route
        path="/admin/banner-manage"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={BannerManage} />
        }
      />
      <Route
        path="/admin/homepage-manage"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={HomepageManage} />
        }
      />

      {/* userManage */}
      <Route
        path="/admin/user-manage"
        element={<AdminRoute allowedRoles={["Admin"]} Component={UserManage} />}
      />
      <Route
        path="/admin/employee-manage"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={EmployeeManage} />
        }
      />
      <Route
        path="/admin/account-manage"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={AccountManage} />
        }
      />
    </Routes>
  );
}
