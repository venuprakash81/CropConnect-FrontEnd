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
// REGISTRATION AND OTHER PAGES
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
import BuyerProfile from "./pages/BuyerProfile";
import BuyerEditProfile from "./pages/BuyerEditProfile";
import BuyerChangePassword from "./pages/BuyerChangePassword";

// =====================================================
// LOGIN AND TRANSPORT PAGES
// =====================================================
import TransportManagement from "./pages/TransportManagement";
import FarmerLogin from "./pages/FarmerLogin";
import TransporterBookings from "./pages/TransporterBookings";
import AllTransporters from "./pages/AllTransporters";
import BuyerLogin from "./pages/BuyerLogin";
import TransporterLogin from "./pages/TransporterLogin";
import WarehouseLogin from "./pages/WarehouseLogin";
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
// AUTOMATIC PAGE TITLE
// =====================================================
function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      // Main pages
      "/": "Home",
      "/about": "About Us",
      "/features": "Features",
      "/how-it-works": "How It Works",
      "/contact": "Contact Us",

      // Registration
      "/farmer-register": "Farmer Registration",
      "/buyer-register": "Buyer Registration",
      "/transport-register": "Transporter Registration",
      "/warehouse-register": "Warehouse Registration",

      // Login
      "/admin/login": "Admin Login",
      "/farmer-login": "Farmer Login",
      "/buyer-login": "Buyer Login",
      "/transporter-login": "Transporter Login",
      "/transporter/login": "Transporter Login",
      "/warehouse-login": "Warehouse Login",

      // Dashboards
      "/farmer-dashboard": "Farmer Dashboard",
      "/buyer-dashboard": "Buyer Dashboard",
      "/transporter/dashboard": "Transporter Dashboard",
      "/warehouse/dashboard": "Warehouse Dashboard",
      "/admin/dashboard": "Admin Dashboard",

      // Farmer pages
      "/my-crops": "My Crops",
      "/add-crop": "Add Crop",
      "/all-farmers": "All Farmers",
      "/farmer-profile": "Farmer Profile",
      "/edit-profile": "Edit Farmer Profile",
      "/change-password": "Change Password",
      "/farmer-bookings": "Farmer Bookings",
      "/farmer-orders": "Farmer Orders",
      "/farmer-earnings": "Farmer Earnings",
      "/farmer-transport-booking": "Farmer Transport Booking",

      // Buyer pages
      "/all-buyers": "All Buyers",
      "/all-crops": "Explore Crops",
      "/my-orders": "My Orders",
      "/buyer-profile": "Buyer Profile",
      "/buyer-edit-profile": "Edit Buyer Profile",
      "/buyer-change-password": "Change Buyer Password",
      "/buyer-payments": "Buyer Payments",
      "/buyer-transport-booking": "Buyer Transport Booking",

      // Transporter pages
      "/all-transporters": "All Transporters",
      "/transporter-bookings": "Transporter Bookings",
      "/transporter-payments": "Transporter Payments",
      "/transport-management": "Transport Management",
      "/transporter/profile": "Transporter Profile",
      "/transporter-edit-profile": "Edit Transporter Profile",
      "/transporter-change-password": "Change Transporter Password",

      // Warehouse pages
      "/book-warehouse": "Book a Warehouse",
      "/my-warehouse-bookings": "My Warehouse Bookings",
      "/warehouse/profile": "Warehouse Profile",
      "/warehouse/edit-profile": "Edit Warehouse Profile",
      "/warehouse/change-password": "Change Warehouse Password",
      "/warehouse-payments": "Warehouse Payments",
      "/warehouse-transport-booking": "Warehouse Transport Booking",

      // Market and weather
      "/market-prices": "Market Prices",
      "/admin/market-prices": "Manage Market Prices",
      "/weather": "Weather Forecast",

      // Administration
      "/admin/farmers": "Manage Farmers",
      "/admin/buyers": "Manage Buyers",
      "/admin/crops": "Manage Crops",
      "/admin/warehouses": "Manage Warehouses",
      "/admin/transporters": "Manage Transporters",

      // Other pages
      "/chat": "Messages",
      "/cropconnect-ai": "CropConnect AI",
    };

    let pageTitle = titles[location.pathname];

    // Handle dynamic routes.
    if (location.pathname.startsWith("/edit-crop/")) {
      pageTitle = "Edit Crop";
    }

    // Fallback for any route not listed above.
    document.title = pageTitle
      ? `${pageTitle} | CropConnect`
      : "CropConnect | Farmer-to-Market Platform";
  }, [location.pathname]);

  return null;
}

// =====================================================
// APPLICATION ROUTES
// =====================================================
function App() {
  return (
    <BrowserRouter>
      <PageTitle />

      <Routes>
        {/* Home and information */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />

        {/* Farmer registration and login */}
        <Route
          path="/farmer-register"
          element={<FarmerRegister />}
        />
        <Route path="/farmer-login" element={<FarmerLogin />} />

        {/* Farmer dashboard and features */}
        <Route
          path="/farmer-dashboard"
          element={<FarmerDashboard />}
        />
        <Route path="/my-crops" element={<FarmerCrops />} />
        <Route path="/add-crop" element={<AddCrop />} />
        <Route path="/edit-crop/:id" element={<EditCrop />} />
        <Route path="/farmer-profile" element={<FarmerProfile />} />
        <Route
          path="/edit-profile"
          element={<EditFarmerProfile />}
        />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/all-farmers" element={<AllFarmers />} />
        <Route path="/farmer-bookings" element={<FarmerBookings />} />
        <Route path="/farmer-orders" element={<FarmerBookings />} />
        <Route
          path="/farmer-earnings"
          element={
            <FarmerEarnings
              farmerEmail={localStorage.getItem("farmerEmail")}
            />
          }
        />
        <Route
          path="/farmer-transport-booking"
          element={<FarmerTransportBooking />}
        />

        {/* Buyer registration and login */}
        <Route
          path="/buyer-register"
          element={<BuyerRegister />}
        />
        <Route path="/buyer-login" element={<BuyerLogin />} />

        {/* Buyer dashboard and features */}
        <Route
          path="/buyer-dashboard"
          element={<BuyerDashboard />}
        />
        <Route path="/buyer-profile" element={<BuyerProfile />} />
        <Route
          path="/buyer-edit-profile"
          element={<BuyerEditProfile />}
        />
        <Route
          path="/buyer-change-password"
          element={<BuyerChangePassword />}
        />
        <Route path="/all-buyers" element={<AllBuyers />} />
        <Route path="/all-crops" element={<AllCrops />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/buyer-payments" element={<BuyerPayments />} />
        <Route
          path="/buyer-transport-booking"
          element={<BuyerTransportBooking />}
        />

        {/* Transporter registration and login */}
        <Route
          path="/transport-register"
          element={<TransportRegister />}
        />
        <Route
          path="/transporter-login"
          element={<TransporterLogin />}
        />
        <Route
          path="/transporter/login"
          element={<TransporterLogin />}
        />

        {/* Transporter dashboard and features */}
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
        <Route
          path="/transporter-bookings"
          element={<TransporterBookings />}
        />
        <Route
          path="/transporter-payments"
          element={<TransporterPayments />}
        />
        <Route
          path="/all-transporters"
          element={<AllTransporters />}
        />
        <Route
          path="/transport-management"
          element={<TransportManagement />}
        />

        {/* Warehouse registration and login */}
        <Route
          path="/warehouse-register"
          element={<WarehouseRegister />}
        />
        <Route
          path="/warehouse-login"
          element={<WarehouseLogin />}
        />

        {/* Warehouse dashboard and features */}
        <Route
          path="/warehouse/dashboard"
          element={<WarehouseDashboard />}
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
          path="/book-warehouse"
          element={<BookWarehouse />}
        />
        <Route
          path="/my-warehouse-bookings"
          element={<MyWarehouseBookings />}
        />
        <Route
          path="/warehouse-payments"
          element={<WarehousePayments />}
        />
        <Route
          path="/warehouse-transport-booking"
          element={<WarehouseTransportBooking />}
        />

        {/* Market prices and weather */}
        <Route path="/market-prices" element={<MarketPrices />} />
        <Route
          path="/admin/market-prices"
          element={<AdminMarketPrices />}
        />
        <Route path="/weather" element={<Weather />} />

        {/* Administration */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
        <Route path="/admin/farmers" element={<AdminFarmers />} />
        <Route path="/admin/buyers" element={<AdminBuyers />} />
        <Route path="/admin/crops" element={<AdminCrops />} />
        <Route
          path="/admin/warehouses"
          element={<AdminWarehouses />}
        />
        <Route
          path="/admin/transporters"
          element={<AdminTransporters />}
        />

        {/* Chat and AI */}
        <Route path="/chat" element={<ChatPage />} />
        <Route
          path="/cropconnect-ai"
          element={<CropConnectAI />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
