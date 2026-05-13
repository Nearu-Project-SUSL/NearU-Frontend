import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

// Public Pages (non-lazy — needed immediately)
import LoadingScreen from "./pages/public/LoadingScreen";
import FoodPage from "./pages/protected/Food";
import ShopDetailPage from "./pages/protected/ShopDetail";

import ProtectedRoute from "./routing/ProtectedRoute";
import Unauthorized from "./pages/public/Unauthorized";

// Helper for wrapping lazy pages in Suspense
const Loadable = (Component: any) => (props: any) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// ── Public Pages (lazy) ───────────────────────────────────────────────────────
const Login = Loadable(lazy(() => import("./pages/public/Login")));
const Register = Loadable(lazy(() => import("./pages/public/Register")));
const ForgotPassword = Loadable(lazy(() => import("./pages/public/ForgotPassword")));
const ResetPassword = Loadable(lazy(() => import("./pages/public/ResetPassword")));

// ── Protected Pages (lazy) ────────────────────────────────────────────────────
const Home = Loadable(lazy(() => import("./pages/protected/Home")));
const Jobs = Loadable(lazy(() => import("./pages/protected/Jobs")));
const CreateJob = Loadable(lazy(() => import("./pages/protected/CreateJob")));
const UpdateJob = Loadable(lazy(() => import("./pages/protected/UpdateJob")));
const MyJobs = Loadable(lazy(() => import("./pages/protected/MyJobs")));
const Profile = Loadable(lazy(() => import("./pages/protected/Profile")));
const TransportSelection = Loadable(lazy(() => import("./pages/protected/transport/TransportSelection")));
const Transport = Loadable(lazy(() => import("./pages/protected/transport/Transport")));
const Accommodation = Loadable(lazy(() => import("./pages/public/Accommodation")));
const AccommodationDetail = Loadable(lazy(() => import("./pages/public/AccommodationDetail")));

// ── Role-specific Pages (lazy) ────────────────────────────────────────────────
const AdminHome = Loadable(lazy(() => import("./pages/protected/AdminHome")));
const BusinessOwnerHome = Loadable(lazy(() => import("./pages/protected/BusinessOwnerHome")));
const RiderHome = Loadable(lazy(() => import("./pages/protected/RiderHome")));
const RiderProfile = Loadable(lazy(() => import("./pages/protected/RiderProfile")));

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
        path: "/jobs",
        Component: Jobs,
      },
     {
        path: "/food/:id",
        Component: ShopDetailPage,
      },
      {
        path: "/jobs/create",
        Component: CreateJob,
      },
      {
        path: "/jobs/update/:id",
        Component: UpdateJob,
      },
      {
        path: "/my-jobs",
        Component: MyJobs,
      },
      {
        path: "/profile",
        Component: Profile,
      },
      {
        path: "/food",
        Component: FoodPage,
      },
      {
        path: "/transport",
        Component: TransportSelection,
      },
      {
        path: "/transport/bus",
        Component: Transport,
      },
      {
        path: "/transport/train",
        Component: Transport,
      },
      {
        path: "/transport/tuk",
        Component: Transport,
      },
      {
        path: "/transport/all",
        Component: Transport,
      },
      {
        path: "/accommodation",
        Component: Accommodation,
      },
      {
        path: "/accommodation/:id",
        Component: AccommodationDetail,
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
