import HomePage from "../pages/clientPages/HomePage";

export default function UserHomeRedirect() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (user?.role === "Admin") {
    window.location.href = "/admin";
    return null;
  }

  if (user?.role === "Driver") {
    window.location.href = "/driver/dashboard";
    return null;
  }

  return <HomePage />;
}
