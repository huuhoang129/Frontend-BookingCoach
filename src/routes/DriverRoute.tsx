//src/routes/DriverRoute.tsx
import ProtectedRoute from "./ProtectedRoute";
import DriverTemplate from "../templates/driverTemplate";

// Props
interface DriverRouteProps {
  allowedRoles: string[];
  Component: React.ComponentType<any>;
}

// Component: AdminRoute
export default function DriverRoute({
  allowedRoles,
  Component,
}: DriverRouteProps) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <DriverTemplate Component={Component} />
    </ProtectedRoute>
  );
}
