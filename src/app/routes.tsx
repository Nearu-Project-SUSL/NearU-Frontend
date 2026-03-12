import { createBrowserRouter } from "react-router";

// Public Pages
import LoadingScreen from "./pages/public/LoadingScreen";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";

// Protected Pages
import Home from "./pages/protected/Home";
import Profile from "./pages/protected/Profile";
import AdminHome from "./pages/protected/AdminHome";
import BusinessOwnerHome from "./pages/protected/BusinessOwnerHome";
import RiderHome from "./pages/protected/RiderHome";
import RiderProfile from "./pages/protected/RiderProfile";

import ProtectedRoute from "./routing/ProtectedRoute";
import Unauthorized from "./pages/public/Unauthorized";

export const router = createBrowserRouter([
  // Public Routes - Accessible to anyone
  {
    path: "/",
    Component: LoadingScreen,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/unauthorized",
    Component: Unauthorized,
  },

  // Protected Routes - Requires Authentication (Any Role)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/home",
        Component: Home,
      },
      {
        path: "/profile",
        Component: Profile,
      },
    ]
  },

  // Protected Routes - Requires Admin Role
  {
    element: <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]} />,
    children: [
      {
        path: "/admin-home",
        Component: AdminHome,
      },
    ]
  },

  // Protected Routes - Requires BusinessOwner Role
  {
    element: <ProtectedRoute allowedRoles={["BusinessOwner"]} />,
    children: [
      {
        path: "/business-owner-home",
        Component: BusinessOwnerHome,
      },
    ]
  },

  // Protected Routes - Requires Rider Role
  {
    element: <ProtectedRoute allowedRoles={["Rider"]} />,
    children: [
      {
        path: "/rider-home",
        Component: RiderHome,
      },
      {
        path: "/rider-profile",
        Component: RiderProfile,
      },
    ]
  }
]);