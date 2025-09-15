import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (user && user.role && allowedRoles.includes(user.role)) {
    return <>{children}</>; // render thẳng children
  }

  return <Navigate to="/" replace />;
}
