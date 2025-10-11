import ProtectedRoute from "./ProtectedRoute";
import DriverTemplate from "../templates/driverTemplate";

interface DriverRouteProps {
  allowedRoles: string[];
  Component: React.ComponentType<any>;
}

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
