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
import RoutesManage from "./pages/adminPages/stationManage/routesManage";
import BookingPage from "./pages/clientPages/BookingPage";
import CheckOutPage from "./pages/clientPages/CheckoutPage";
import PaymentResultPage from "./pages/clientPages/paymentResult/paymentResultPage";
import CheckoutSuccessPage from "./pages/clientPages/paymentResult/checkoutSuccessPage";
import CheckoutFailedPage from "./pages/clientPages/paymentResult/checkoutFailedPage";
import VehiclePage from "./pages/adminPages/vehicleManage/vehiclePage";
import VehicleStatusPage from "./pages/adminPages/vehicleManage/vehicleStatusPage";
import TicketPricingPage from "./pages/adminPages/tripManage/ticketPricingPage";
import TicketListPage from "./pages/adminPages/tripManage/tripListPage";
import SchedulePage from "./pages/adminPages/tripManage/schedulePage";
import BookingPageAdmin from "./pages/adminPages/ticketManage/bookingPage";
import TicketStatusPage from "./pages/adminPages/ticketManage/ticketStatusPage";

import RevenueReportPage from "./pages/adminPages/reportManage/revenueReportPage";
import TicketSalesPage from "./pages/adminPages/reportManage/ticketSalesPage";
import CancellationRatePage from "./pages/adminPages/reportManage/cancellationRatePage";
import InformationClientPage from "./pages/clientPages/AuthManage/InformationClientPage";
import BookingHistoryPage from "./pages/clientPages/AuthManage/BookingHistoryPage";

import TestPage from "./pages/clientPages/testClient";

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

        <Route path="/booking" element={<BookingPage />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
        <Route path="/checkout-failed" element={<CheckoutFailedPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/profile/info" element={<InformationClientPage />} />
        <Route path="/profile/history" element={<BookingHistoryPage />} />
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

      <Route
        path="/admin/route-list"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={RoutesManage} />
        }
      />

      {/* Booking */}
      <Route
        path="/admin/booking-tickets"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={BookingPageAdmin} />
        }
      />

      <Route
        path="/admin/ticket-status"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={TicketStatusPage} />
        }
      />

      {/* route-list */}
      <Route
        path="/admin/ticket-pricing"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={TicketPricingPage} />
        }
      />
      <Route
        path="/admin/trip-list"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={TicketListPage} />
        }
      />
      <Route
        path="/admin/schedule"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={SchedulePage} />
        }
      />

      {/* vehicleManage */}
      <Route
        path="/admin/vehicle-list"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={VehiclePage} />
        }
      />
      <Route
        path="/admin/vehicle-condition"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={VehicleStatusPage} />
        }
      />

      {/* reportManage */}
      <Route
        path="/admin/revenue-reports"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={RevenueReportPage} />
        }
      />

      <Route
        path="/admin/ticket-sales"
        element={
          <AdminRoute allowedRoles={["Admin"]} Component={TicketSalesPage} />
        }
      />

      <Route
        path="/admin/cancellation-rates"
        element={
          <AdminRoute
            allowedRoles={["Admin"]}
            Component={CancellationRatePage}
          />
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
