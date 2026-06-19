import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

// LoadingScreen is eagerly imported so it can be used as the Suspense fallback
import LoadingScreen from "./pages/public/LoadingScreen";
import ProtectedRoute from "./routing/ProtectedRoute";

// Helper to retry dynamic imports when a chunk fails to load (e.g. after redeployment)
const lazyWithRetry = (componentImport: () => Promise<any>) => {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error("Failed to load chunk. Reloading page to fetch latest assets...", error);
      const lastReload = sessionStorage.getItem('last-chunk-reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem('last-chunk-reload', now.toString());
        window.location.reload();
      }
      throw error;
    }
  });
};

// Helper for wrapping lazy pages in Suspense
const Loadable = (Component: any) => (props: any) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// ── Public Pages (lazy) ───────────────────────────────────────────────────────
const Login = Loadable(lazyWithRetry(() => import("./pages/public/Login")));
const Register = Loadable(lazyWithRetry(() => import("./pages/public/Register")));
const ForgotPassword = Loadable(lazyWithRetry(() => import("./pages/public/ForgotPassword")));
const ResetPassword = Loadable(lazyWithRetry(() => import("./pages/public/ResetPassword")));
const Unauthorized = Loadable(lazyWithRetry(() => import("./pages/public/Unauthorized")));
const LandingPage = Loadable(lazyWithRetry(() => import("./pages/public/LandingPage")));
const LegalHub = Loadable(lazyWithRetry(() => import("./pages/public/LegalHub")));

// ── Protected Pages (lazy) ────────────────────────────────────────────────────
const Home = Loadable(lazyWithRetry(() => import("./pages/protected/Home")));
const Jobs = Loadable(lazyWithRetry(() => import("./pages/protected/Jobs")));
const CreateJob = Loadable(lazyWithRetry(() => import("./pages/protected/CreateJob")));
const UpdateJob = Loadable(lazyWithRetry(() => import("./pages/protected/UpdateJob")));
const MyJobs = Loadable(lazyWithRetry(() => import("./pages/protected/MyJobs")));
const Profile = Loadable(lazyWithRetry(() => import("./pages/protected/Profile")));
const TransportSelection = Loadable(lazyWithRetry(() => import("./pages/protected/transport/TransportSelection")));
const Transport = Loadable(lazyWithRetry(() => import("./pages/protected/transport/Transport")));
const FoodPage = Loadable(lazyWithRetry(() => import("./pages/protected/Food")));
const ShopDetailPage = Loadable(lazyWithRetry(() => import("./pages/protected/ShopDetail")));
const Accommodation = Loadable(lazyWithRetry(() => import("./pages/public/Accommodation")));
const AccommodationDetail = Loadable(lazyWithRetry(() => import("./pages/public/AccommodationDetail")));
const Gifts = Loadable(lazyWithRetry(() => import("./pages/protected/Gifts")));
const GiftShopDetailPage = Loadable(lazyWithRetry(() => import("./pages/protected/GiftShopDetail")));
const DealsPage = Loadable(lazyWithRetry(() => import("./pages/protected/Deals")));
const AdminDealsPage = Loadable(lazyWithRetry(() => import("./pages/protected/AdminDeals")));
const Rides = Loadable(lazyWithRetry(() => import("./pages/protected/Ridespage")));

// ── Role-specific Pages (lazy) ────────────────────────────────────────────────
const AdminHome = Loadable(lazyWithRetry(() => import("./pages/protected/AdminHome")));
const BusinessOwnerHome = Loadable(lazyWithRetry(() => import("./pages/protected/BusinessOwnerHome")));
const RiderHome = Loadable(lazyWithRetry(() => import("./pages/protected/RiderHome")));
const RiderProfile = Loadable(lazyWithRetry(() => import("./pages/protected/RiderProfile")));

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
  {
    path: "/privacy-policy",
    Component: LegalHub,
  },
  {
    path: "/terms-and-conditions",
    Component: LegalHub,
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

  // Protected Routes - Requires Student Role
  {
    element: <ProtectedRoute allowedRoles={["Student"]} />,
    children: [
      {
        path: "/deals",
        Component: DealsPage,
      },
      {
        path: "/rides",
        Component: Rides,
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
      {
        path: "/admin/deals",
        Component: AdminDealsPage,
      },
    ]
  },

  // Protected Routes - Requires BusinessOwner Role
  {
    element: <ProtectedRoute allowedRoles={["BusinessOwner", "Business"]} />,
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
