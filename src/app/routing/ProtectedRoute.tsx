import { useLocation, Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "../pages/public/LoadingScreen";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { auth, isAuthReady } = useAuth();
  const location = useLocation();

  // Wait for the startup token refresh to complete before making auth decisions.
  // Without this, a valid session briefly appears as logged-out during page reload
  // because auth.user is null until the async refresh resolves.
  if (!isAuthReady) {
    return <LoadingScreen />;
  }

  if (!auth?.user) {
    // If not logged in, redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // // If a specific role is required and the user doesn't have it
  if (allowedRoles && !auth?.user?.roles?.some((role: string) => allowedRoles.includes(role))) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // The user is logged in and has permission, render the child routes/components
  return <Outlet />;
};

export default ProtectedRoute;
