import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

// =====================================================
// MAIN PAGES
// =====================================================
import FarmerCrops from "./pages/FarmerCrops";
import FarmerProfile from "./pages/FarmerProfile";

import AdminWarehouses from "./pages/AdminWarehouses";
import AdminCrops from "./pages/AdminCrops";
import AdminBuyers from "./pages/AdminBuyers";
import AdminFarmers from "./pages/AdminFarmers";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import BookWarehouse from "./pages/BookWarehouse";
import About from "./pages/About";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import EditCrop from "./pages/EditCrop";
import Weather from "./pages/Weather";
import FarmerTransportBooking from "./pages/FarmerTransportBooking";
import BuyerTransportBooking from "./pages/BuyerTransportBooking";
import WarehouseTransportBooking from "./pages/WarehouseTransportBooking";
import AllFarmers from "./pages/AllFarmers";
import WarehousePayments from "./pages/WarehousePayments";
import MarketPrices from "./pages/MarketPrices";
import ChatPage from "./pages/ChatPage";
import EditFarmerProfile from "./pages/EditFarmerProfile";
import ChangePassword from "./pages/ChangePassword";
import TransporterProfile from "./pages/TransporterProfile";
import EditTransporterProfile from "./pages/EditTransporterProfile";
import ChangeTransporterPassword from "./pages/ChangeTransporterPassword";
import WarehouseProfile from "./pages/WarehouseProfile";
import WarehouseEditProfile from "./pages/WarehouseEditProfile";
import WarehouseChangePassword from "./pages/WarehouseChangePassword";

// =====================================================
// REGISTRATION / OTHER PAGES
// =====================================================
import AllBuyers from "./pages/AllBuyers";
import AdminMarketPrices from "./pages/AdminMarketPrices";
import FarmerRegister from "./pages/FarmerRegister";
import BuyerRegister from "./pages/BuyerRegister";
import TransportRegister from "./pages/TransporterRegister";
import WarehouseRegister from "./pages/WarehouseRegister";
import AllCrops from "./pages/AllCrops";
import FarmerBookings from "./pages/FarmerBookings";
import FarmerEarnings from "./pages/FarmerEarnings";
import BuyerPayments from "./pages/BuyerPayments";
import WarehouseDetails from "./pages/WarehouseDetails";
import BuyerProfile from "./pages/BuyerProfile";
import BuyerEditProfile from "./pages/BuyerEditProfile";
import BuyerChangePassword from "./pages/BuyerChangePassword";
// =====================================================
// LOGIN / TRANSPORT PAGES
// =====================================================
import TransportManagement from "./pages/TransportManagement";
import FarmerLogin from "./pages/FarmerLogin";
import TransporterBookings from "./pages/TransporterBookings";
import AllTransporters from "./pages/AllTransporters";
import BuyerLogin from "./pages/BuyerLogin";
import TransporterLogin from "./pages/TransporterLogin";
import WarehouseLogin from "./pages/WarehouseLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import CropConnectAI from "./pages/CropConnectAI";
import TransporterPayments from "./pages/TransporterPayments";

// =====================================================
// DASHBOARD PAGES
// =====================================================
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import TransporterDashboard from "./pages/TransporterDashboard";
import WarehouseDashboard from "./pages/WarehouseDashboard";
import MyOrders from "./pages/MyOrders";
import AddCrop from "./pages/AddCrop";
import AdminTransporters from "./pages/AdminTransporters";
import MyWarehouseBookings from "./pages/MyWarehouseBookings";

// =====================================================
// PAGE TITLE COMPONENT
// =====================================================

function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const titles = {

      // =================================================
      // MAIN PAGES
      // =================================================

      "/":
        "CropConnect | Home",

      "/about":
        "CropConnect | About",

      "/features":
        "CropConnect | Features",

      "/how-it-works":
        "CropConnect | How It Works",

      "/contact":
        "CropConnect | Contact",

      // =================================================
      // REGISTRATION PAGES
      // =================================================

      "/farmer-register":
        "CropConnect | Farmer Registration",

      "/buyer-register":
        "CropConnect | Buyer Registration",

      "/transport-register":
        "CropConnect | Transporter Registration",

      "/warehouse-register":
        "CropConnect | Warehouse Registration",

      // =================================================
      // LOGIN PAGES
      // =================================================

      "/admin/login":
        "CropConnect | Admin Login",

      "/farmer-login":
        "CropConnect | Farmer Login",

      "/buyer-login":
        "CropConnect | Buyer Login",

      "/transporter-login":
        "CropConnect | Transporter Login",

      "/warehouse-login":
        "CropConnect | Warehouse Login",

      // =================================================
      // DASHBOARD PAGES
      // =================================================

      "/farmer-dashboard":
        "CropConnect | Farmer Dashboard",

      "/buyer-dashboard":
        "CropConnect | Buyer Dashboard",

      "/transporter/dashboard":
        "CropConnect | Transporter Dashboard",

      "/warehouse/dashboard":
        "CropConnect | Warehouse Dashboard",

      "/admin/dashboard":
        "CropConnect | Admin Dashboard",

      // =================================================
      // FARMER PAGES
      // =================================================

      "/my-crops":
        "CropConnect | My Crops",

      "/add-crop":
        "CropConnect | Add Crop",

      "/all-farmers":
        "CropConnect | All Farmers",

      "/farmer-earnings":
        "CropConnect | Farmer Earnings",

      "/farmer-transport-booking":
        "CropConnect | Farmer Transport Booking",

      // =================================================
      // BUYER PAGES
      // =================================================

      "/all-buyers":
        "CropConnect | All Buyers",

      "/all-crops":
        "CropConnect | All Crops",

      "/my-orders":
        "CropConnect | My Orders",

      "/buyer-payments":
        "CropConnect | Buyer Payments",

      "/buyer-transport-booking":
        "CropConnect | Buyer Transport Booking",

      // =================================================
      // TRANSPORTER PAGES
      // =================================================

      "/all-transporters":
        "CropConnect | All Transporters",

      "/transporter-bookings":
        "CropConnect | Transporter Bookings",

      "/transporter-payments":
        "CropConnect | Transporter Payments",

      "/transport-management":
        "CropConnect | Transport Management",

      // =================================================
      // WAREHOUSE PAGES
      // =================================================

      "/book-warehouse":
        "CropConnect | Book Warehouse",

      "/my-warehouse-bookings":
        "CropConnect | My Warehouse Bookings",

      "/warehouse-payments":
        "CropConnect | Warehouse Payments",

      "/warehouse-transport-booking":
        "CropConnect | Warehouse Transport Booking",

      // =================================================
      // MARKET / WEATHER
      // =================================================

      "/market-prices":
        "CropConnect | Market Prices",

      "/admin/market-prices":
        "CropConnect | Manage Market Prices",

      "/weather":
        "CropConnect | Weather",

      // =================================================
      // ADMIN PAGES
      // =================================================

      "/admin/farmers":
        "CropConnect | Manage Farmers",

      "/admin/buyers":
        "CropConnect | Manage Buyers",

      "/admin/crops":
        "CropConnect | Manage Crops",

      "/admin/warehouses":
        "CropConnect | Manage Warehouses",

      "/admin/transporters":
        "CropConnect | Manage Transporters",

      // =================================================
      // OTHER PAGES
      // =================================================

      "/chat":
        "CropConnect | Chat",

      "/cropconnect-ai":
        "CropConnect | CropConnect AI",

    };

    document.title =
      titles[location.pathname] || "CropConnect";

  }, [location.pathname]);

  return null;
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      {/* =================================================
          AUTOMATIC PAGE TITLE
      ================================================= */}

      <PageTitle />

      <Routes>

        {/* =================================================
            TRANSPORTER PAYMENTS
        ================================================= */}

        <Route
          path="/transporter-payments"
          element={<TransporterPayments />}
        />
        <Route
  path="/buyer-edit-profile"
  element={<BuyerEditProfile />}
/>
<Route
  path="/change-password"
  element={<ChangePassword />}
/>
        {/* =================================================
            FARMER EARNINGS
        ================================================= */}

        <Route
          path="/farmer-earnings"
          element={
            <FarmerEarnings
              farmerEmail={localStorage.getItem("farmerEmail")}
            />
          }
        />

        {/* =================================================
            WAREHOUSE BOOKING
        ================================================= */}
<Route
  path="/buyer-change-password"
  element={<BuyerChangePassword />}
/>
        <Route
          path="/book-warehouse"
          element={<BookWarehouse />}
        />

                <Route
          path="/warehouse/profile"
          element={<WarehouseProfile />}
        />

        <Route
          path="/warehouse/edit-profile"
          element={<WarehouseEditProfile />}
        />

        <Route
          path="/warehouse/change-password"
          element={<WarehouseChangePassword />}
        />


<Route
  path="/edit-profile"
  element={<EditFarmerProfile />}
/>
        <Route
          path="/my-warehouse-bookings"
          element={<MyWarehouseBookings />}
        />
           <Route path="/farmer-profile" element={<FarmerProfile />} />

        <Route
          path="/warehouse-details/:id"
          element={<WarehouseDetails />}
        />
<Route path="/farmer-bookings" element={<FarmerBookings />} />
        {/* =================================================
            TRANSPORTER BOOKINGS
        ================================================= */}
 <Route
          path="/transporter/dashboard"
          element={<TransporterDashboard />}
        />

        <Route
          path="/transporter/profile"
          element={<TransporterProfile />}
        />

        <Route
          path="/transporter-edit-profile"
          element={<EditTransporterProfile />}
        />

        <Route
          path="/transporter-change-password"
          element={<ChangeTransporterPassword />}
        />

        {/* Replace with your existing transporter login route. */}
        <Route
          path="/transporter/login"
          element={<div>Please connect your existing transporter login page.</div>}
        />

        
        <Route
          path="/transporter-bookings"
          element={<TransporterBookings />}
        />
<Route
  path="/farmer-orders"
  element={<FarmerBookings />}
/>
        <Route
          path="/all-transporters"
          element={<AllTransporters />}
        />

        <Route
          path="/transport-management"
          element={<TransportManagement />}
        />

        {/* =================================================
            MARKET PRICES
        ================================================= */}

        <Route
          path="/market-prices"
          element={<MarketPrices />}
        />

        <Route
          path="/admin/market-prices"
          element={<AdminMarketPrices />}
        />

        {/* =================================================
            MAIN HOME PAGE
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =================================================
            FARMERS
        ================================================= */}

        <Route
          path="/all-farmers"
          element={<AllFarmers />}
        />

        <Route path="/buyer-profile" element={<BuyerProfile />} />

        <Route
          path="/my-crops"
          element={<FarmerCrops />}
        />

        <Route
          path="/add-crop"
          element={<AddCrop />}
        />

        <Route
          path="/edit-crop/:id"
          element={<EditCrop />}
        />

        <Route
          path="/farmer-transport-booking"
          element={<FarmerTransportBooking />}
        />

        {/* =================================================
            BUYERS
        ================================================= */}

        <Route
          path="/admin/buyers"
          element={<AdminBuyers />}
        />

        <Route
          path="/all-buyers"
          element={<AllBuyers />}
        />

        <Route
          path="/all-crops"
          element={<AllCrops />}
        />

        <Route
          path="/my-orders"
          element={<MyOrders />}
        />

        <Route
          path="/buyer-payments"
          element={<BuyerPayments />}
        />

        <Route
          path="/buyer-transport-booking"
          element={<BuyerTransportBooking />}
        />

        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/farmers"
          element={<AdminFarmers />}
        />

        <Route
          path="/admin/crops"
          element={<AdminCrops />}
        />

        <Route
          path="/admin/warehouses"
          element={<AdminWarehouses />}
        />

        <Route
          path="/admin/transporters"
          element={<AdminTransporters />}
        />

        {/* =================================================
            CHAT
        ================================================= */}

        <Route
          path="/chat"
          element={<ChatPage />}
        />

        {/* =================================================
            WAREHOUSE PAYMENTS
        ================================================= */}

        <Route
          path="/warehouse-payments"
          element={<WarehousePayments />}
        />

        {/* =================================================
            CROP CONNECT AI
        ================================================= */}

        <Route
          path="/cropconnect-ai"
          element={<CropConnectAI />}
        />

        {/* =================================================
            WAREHOUSE TRANSPORT BOOKING
        ================================================= */}

        <Route
          path="/warehouse-transport-booking"
          element={<WarehouseTransportBooking />}
        />

        {/* =================================================
            MAIN INFORMATION PAGES
        ================================================= */}

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/features"
          element={<Features />}
        />

        <Route
          path="/how-it-works"
          element={<HowItWorks />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* =================================================
            WEATHER
        ================================================= */}

        <Route
          path="/weather"
          element={<Weather />}
        />

        {/* =================================================
            FARMER REGISTRATION
        ================================================= */}

        <Route
          path="/farmer-register"
          element={<FarmerRegister />}
        />

        {/* =================================================
            BUYER REGISTRATION
        ================================================= */}

        <Route
          path="/buyer-register"
          element={<BuyerRegister />}
        />

        {/* =================================================
            TRANSPORTER REGISTRATION
        ================================================= */}

        <Route
          path="/transport-register"
          element={<TransportRegister />}
        />

        {/* =================================================
            WAREHOUSE REGISTRATION
        ================================================= */}

        <Route
          path="/warehouse-register"
          element={<WarehouseRegister />}
        />

        {/* =================================================
            FARMER LOGIN
        ================================================= */}

        <Route
          path="/farmer-login"
          element={<FarmerLogin />}
        />

        {/* =================================================
            BUYER LOGIN
        ================================================= */}

        <Route
          path="/buyer-login"
          element={<BuyerLogin />}
        />

        {/* =================================================
            TRANSPORTER LOGIN
        ================================================= */}

        <Route
          path="/transporter-login"
          element={<TransporterLogin />}
        />

        {/* =================================================
            WAREHOUSE LOGIN
        ================================================= */}

        <Route
          path="/warehouse-login"
          element={<WarehouseLogin />}
        />

        {/* =================================================
            FARMER DASHBOARD
        ================================================= */}

        <Route
          path="/farmer-dashboard"
          element={<FarmerDashboard />}
        />

        {/* =================================================
            BUYER DASHBOARD
        ================================================= */}

        <Route
          path="/buyer-dashboard"
          element={<BuyerDashboard />}
        />

        {/* =================================================
            TRANSPORTER DASHBOARD
        ================================================= */}

        <Route
          path="/transporter/dashboard"
          element={<TransporterDashboard />}
        />

        {/* =================================================
            WAREHOUSE DASHBOARD
        ================================================= */}

        <Route
          path="/warehouse/dashboard"
          element={<WarehouseDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;