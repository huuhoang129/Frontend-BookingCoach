import { Routes, Route } from "react-router-dom";
import HomeTemplate from "./templates/clientTemplates";
import AdminTemplate from "./templates/adminTemplates";
import HomePage from "./pages/clientPages/HomePage";
import DashboardPage from "./pages/adminPages/DashboardPage";

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
    </Routes>
  );
}
