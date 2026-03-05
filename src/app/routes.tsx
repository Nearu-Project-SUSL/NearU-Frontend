import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import LoadingScreen from "./pages/LoadingScreen";
import LocationPermission from "./pages/LocationPermission";
import Transport from "./pages/Transport";
import TransportSelection from "./pages/TransportSelection";
import TukRiders from "./pages/TukRiders";
import Rides from "./pages/Rides";
import Food from "./pages/Food";
import FoodVendor from "./pages/FoodVendor";
import Gifts from "./pages/Gifts";
import GiftShop from "./pages/GiftShop";
import Accommodation from "./pages/Accommodation";
import AccommodationDetail from "./pages/AccommodationDetail";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Deals from "./pages/Deals";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import RiderHome from "./pages/RiderHome";
import RiderProfile from "./pages/RiderProfile";
import BusinessOwnerHome from "./pages/BusinessOwnerHome";
import AdminHome from "./pages/AdminHome";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoadingScreen,
  },
  {
    path: "/location-permission",
    Component: LocationPermission,
  },
  {
    path: "/landing",
    Component: LandingPage,
  },
  {
    path: "/home",
    Component: Home,
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
    path: "/transport",
    Component: TransportSelection,
  },
  {
    path: "/transport/tuk",
    Component: TukRiders,
  },
  {
    path: "/transport/all",
    Component: Transport,
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
    path: "/transport/bike",
    Component: Rides,
  },
  {
    path: "/rides",
    Component: Rides,
  },
  {
    path: "/food",
    Component: Food,
  },
  {
    path: "/food/:vendorId",
    Component: FoodVendor,
  },
  {
    path: "/gifts",
    Component: Gifts,
  },
  {
    path: "/gifts/:shopId",
    Component: GiftShop,
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
    path: "/jobs",
    Component: Jobs,
  },
  {
    path: "/jobs/:id",
    Component: JobDetail,
  },
  {
    path: "/deals",
    Component: Deals,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/favorites",
    Component: Favorites,
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
    path: "/rider-home",
    Component: RiderHome,
  },
  {
    path: "/rider-profile",
    Component: RiderProfile,
  },
  {
    path: "/business-owner-home",
    Component: BusinessOwnerHome,
  },
  {
    path: "/admin-home",
    Component: AdminHome,
  },
]);