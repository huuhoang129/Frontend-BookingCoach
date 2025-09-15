import AdminTemplate from "../templates/adminTemplates";
import ProtectedRoute from "./ProtectedRoute";

// Props
interface AdminRouteProps {
  allowedRoles: string[];
  Component: React.ComponentType<any>;
}

// Component: AdminRoute
export default function AdminRoute({
  allowedRoles,
  Component,
}: AdminRouteProps) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <AdminTemplate Component={Component} />
    </ProtectedRoute>
  );
}
