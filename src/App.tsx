import { Routes, Route } from "react-router-dom";
import HomeTemplate from "./templates/clientTemplates";
import AdminRoute from "./routes/AdminRoute";

// client pages
import HomePage from "./pages/clientPages/HomePage";
import ContactPage from "./pages/clientPages/staticPage/contactPage";
import AboutPage from "./pages/clientPages/staticPage/AboutPage";
import TermPage from "./pages/clientPages/staticPage/TermPage";
import PrivacyPolicyPage from "./pages/clientPages/staticPage/PrivacyPolicyPage";
import RefundPolicyPage from "./pages/clientPages/staticPage/RefundPolicyPage";
import PaymentPolicyPage from "./pages/clientPages/staticPage/PaymentPolicyPage";
import CancellationPolicyPage from "./pages/clientPages/staticPage/CancellationPolicyPage";
import ShippingPolicyPage from "./pages/clientPages/staticPage/ShippingPolicyPage";
import NewsPage from "./pages/clientPages/newsPage";
import NewsDetailPage from "./pages/clientPages/NewsDetailPage";

// admin pages
import DashboardPage from "./pages/adminPages/DashboardPage";
import BannerManage from "./pages/adminPages/systemManage/bannerManage";
import HomepageManage from "./pages/adminPages/systemManage/homePageManage";
import UserManage from "./pages/adminPages/usersManage/userManage";
import EmployeeManage from "./pages/adminPages/usersManage/employeeManage";
import AccountManage from "./pages/adminPages/usersManage/accountManage";
import NewsManage from "./pages/adminPages/systemManage/newsManage";
import LocationManage from "./pages/adminPages/stationManage/locationManage";

export default function App() {
  return (
    <Routes>
      {/* Client */}
      <Route element={<HomeTemplate />}>
        <Route index element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id/:slug" element={<NewsDetailPage />} />
        <Route path="/term" element={<TermPage />} />
        <Route path="/privacy_policy" element={<PrivacyPolicyPage />} />
        <Route path="/refund_policy" element={<RefundPolicyPage />} />
        <Route path="/payment_policy" element={<PaymentPolicyPage />} />
        <Route
          path="/cancellation_policy"
          element={<CancellationPolicyPage />}
        />
        <Route path="/shipping_policy" element={<ShippingPolicyPage />} />
      </Route>

      {/* Admin (bọc qua AdminRoute) */}
      <Route
        path="/admin"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={DashboardPage} />
        }
      />

      {/* stationManage */}
      <Route
        path="/admin/location-list"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={LocationManage} />
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
      <Route
        path="/admin/news-manage"
        element={<AdminRoute allowedRoles={["Admin"]} Component={NewsManage} />}
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
