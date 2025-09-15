import { Routes, Route } from "react-router-dom";
import HomeTemplate from "./templates/clientTemplates";
import HomePage from "./pages/clientPages/HomePage";

export default function App() {
  return (
    <Routes>
      <Route element={<HomeTemplate />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
