import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

// LoadingScreen is eagerly imported so it can be used as the Suspense fallback
import LoadingScreen from "./pages/public/LoadingScreen";
import ProtectedRoute from "./routing/ProtectedRoute";

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
const Unauthorized = Loadable(lazy(() => import("./pages/public/Unauthorized")));
const LandingPage = Loadable(lazy(() => import("./pages/public/LandingPage")));

// ── Protected Pages (lazy) ────────────────────────────────────────────────────
const Home = Loadable(lazy(() => import("./pages/protected/Home")));
const Jobs = Loadable(lazy(() => import("./pages/protected/Jobs")));
const CreateJob = Loadable(lazy(() => import("./pages/protected/CreateJob")));
const UpdateJob = Loadable(lazy(() => import("./pages/protected/UpdateJob")));
const MyJobs = Loadable(lazy(() => import("./pages/protected/MyJobs")));
const Profile = Loadable(lazy(() => import("./pages/protected/Profile")));
const TransportSelection = Loadable(lazy(() => import("./pages/protected/transport/TransportSelection")));
const Transport = Loadable(lazy(() => import("./pages/protected/transport/Transport")));
const FoodPage = Loadable(lazy(() => import("./pages/protected/Food")));
const ShopDetailPage = Loadable(lazy(() => import("./pages/protected/ShopDetail")));
const Accommodation = Loadable(lazy(() => import("./pages/public/Accommodation")));
const AccommodationDetail = Loadable(lazy(() => import("./pages/public/AccommodationDetail")));
const Gifts = Loadable(lazy(() => import("./pages/protected/Gifts")));
const GiftShopDetailPage = Loadable(lazy(() => import("./pages/protected/GiftShopDetail")));

// ── Role-specific Pages (lazy) ────────────────────────────────────────────────
const AdminHome = Loadable(lazy(() => import("./pages/protected/AdminHome")));
const BusinessOwnerHome = Loadable(lazy(() => import("./pages/protected/BusinessOwnerHome")));
const RiderHome = Loadable(lazy(() => import("./pages/protected/RiderHome")));
const RiderProfile = Loadable(lazy(() => import("./pages/protected/RiderProfile")));

export const router = createBrowserRouter([
  // Public Routes - Accessible to anyone
  {
    path: "/",
    Component: LandingPage,
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
      {
        path: "/gifts",
        Component: Gifts,
      },
      {
        path: "/gifts/:id",
        Component: GiftShopDetailPage,
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
