//src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

// Props
interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

// ProtectedRoute
export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  // Check permissions
  if (user && user.role && allowedRoles.includes(user.role)) {
    return <>{children}</>; // render children directly if valid
  }
  // If no permission => redirect
  return <Navigate to="/" replace />;
}
