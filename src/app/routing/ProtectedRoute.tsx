import { useLocation, Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth?.user) {
    // If not logged in, redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required and the user doesn't have it
  if (allowedRoles && !auth.user.roles.some((role) => allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // The user is logged in and has permission, render the child routes/components
  return <Outlet />;
};

export default ProtectedRoute;
