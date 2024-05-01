import React from "react";
import { Navigate } from "react-router-dom";

// Pages Component

// Profile
import UserProfile from "../pages/Authentication/user-profile";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// Inner Authentication
// import Login1 from "../pages/AuthenticationInner/Login";
// import Login2 from "../pages/AuthenticationInner/Login2";
// import Register1 from "../pages/AuthenticationInner/Register";
// import Register2 from "../pages/AuthenticationInner/Register2";
// import Recoverpw from "../pages/AuthenticationInner/Recoverpw";
// import Recoverpw2 from "../pages/AuthenticationInner/Recoverpw2";
// import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";
// import ForgetPwd2 from "../pages/AuthenticationInner/ForgetPassword2";
// import LockScreen from "../pages/AuthenticationInner/auth-lock-screen";
// import LockScreen2 from "../pages/AuthenticationInner/auth-lock-screen-2";
// import ConfirmMail from "../pages/AuthenticationInner/page-confirm-mail";
// import ConfirmMail2 from "../pages/AuthenticationInner/page-confirm-mail-2";

// import TwostepVerification from "../pages/AuthenticationInner/auth-two-step-verification";
// import TwostepVerification2 from "../pages/AuthenticationInner/auth-two-step-verification-2";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import DashboardSaas from "../pages/Dashboard-saas/index";

import DashboardJob from "../pages/DashboardJob/index";

// Charts
// import ChartApex from "../pages/Charts/Apexcharts";
// import ChartistChart from "../pages/Charts/ChartistChart";
// import ChartjsChart from "../pages/Charts/ChartjsChart";
// import EChart from "../pages/Charts/EChart";
// import SparklineChart from "../pages/Charts/SparklineChart";
// import ChartsKnob from "../pages/Charts/charts-knob";
// import ReCharts from "../pages/Charts/ReCharts";

// Maps
// import MapsGoogle from "../pages/Maps/MapsGoogle";
// import MapsVector from "../pages/Maps/MapsVector";
// import MapsLeaflet from "../pages/Maps/MapsLeaflet";

//Icons
// import IconBoxicons from "../pages/Icons/IconBoxicons";
// import IconDripicons from "../pages/Icons/IconDripicons";
// import IconMaterialdesign from "../pages/Icons/IconMaterialdesign";
// import IconFontawesome from "../pages/Icons/IconFontawesome";

//Tables
// import BasicTables from "../pages/Tables/BasicTables";
// import DatatableTables from "../pages/Tables/DatatableTables";
// import ResponsiveTables from "../pages/Tables/ResponsiveTables";
// import DragDropTables from "../pages/Tables/DragDropTables";

// Forms
// import FormElements from "../pages/Forms/FormElements";
// import FormLayouts from "../pages/Forms/FormLayouts";
// import FormAdvanced from "../pages/Forms/FormAdvanced";
// import FormEditors from "../pages/Forms/FormEditors";
// import FormValidations from "../pages/Forms/FormValidations";
// import FormMask from "../pages/Forms/FormMask";
// import FormRepeater from "../pages/Forms/FormRepeater";
// import FormUpload from "../pages/Forms/FormUpload";
// import FormWizard from "../pages/Forms/FormWizard";

//Ui
// import UiAlert from "../pages/Ui/UiAlert";
// import UiButtons from "../pages/Ui/UiButtons";
// import UiCards from "../pages/Ui/UiCards";
// import UiCarousel from "../pages/Ui/UiCarousel";
// import UiColors from "../pages/Ui/UiColors";
// import UiDropdown from "../pages/Ui/UiDropdown";
// import UiGeneral from "../pages/Ui/UiGeneral";
// import UiGrid from "../pages/Ui/UiGrid";
// import UiImages from "../pages/Ui/UiImages";
// import UiLightbox from "../pages/Ui/UiLightbox";
// import UiModal from "../pages/Ui/UiModal";
// import UiProgressbar from "../pages/Ui/UiProgressbar";
// import UiTabsAccordions from "../pages/Ui/UiTabsAccordions";
// import UiTypography from "../pages/Ui/UiTypography";
// import UiVideo from "../pages/Ui/UiVideo";
// import UiSessionTimeout from "../pages/Ui/UiSessionTimeout";
// import UiRating from "../pages/Ui/UiRating";
// import UiRangeSlider from "../pages/Ui/UiRangeSlider";
// import UiNotifications from "../pages/Ui/ui-notifications";
// import UiOffCanvas from "pages/Ui/UiOffCanvas";
// import UiUtilitie from "../pages/Ui/UiUtilitie";
// import UiPlaceholders from "../pages/Ui/UiPlaceholders";
// import UiToasts from "../pages/Ui/UiToast";

//Pages
// import PagesStarter from "../pages/Utility/pages-starter";
// import PagesMaintenance from "../pages/Utility/pages-maintenance";
// import PagesComingsoon from "../pages/Utility/pages-comingsoon";
// import PagesTimeline from "../pages/Utility/pages-timeline";
// import PagesFaqs from "../pages/Utility/pages-faqs";
// import PagesPricing from "../pages/Utility/pages-pricing";
// import Pages404 from "../pages/Utility/pages-404";
// import Pages500 from "../pages/Utility/pages-500";

import City from "pages/Master/City/City";
import Pincode from "pages/Master/Pincode/Pincode";
import Area from "pages/Master/Area/Area";
import Users from "pages/Master/Users/Users";
import EditCity from "pages/Master/City/EditCity";
import PrivateRoute from "pages/Authentication/PrivateRoute";
import { element } from "prop-types";
import ForgetPasswordOTP from "pages/Authentication/ForgetPasswordOTP";
import ChangePassword from "pages/Authentication/ChangePassword";
import TaxRate from "pages/Master/TaxRate/TaxRate";
import EditTaxRate from "pages/Master/TaxRate/EditTaxRate";
import HsnCode from "pages/Master/HsnCode/HsnCode";
import EditHsnCode from "pages/Master/HsnCode/EditHsnCode";
import DeliveryBoy from "pages/Master/Delivery Boy/DeliveryBoy";
import CustomerGroup from "pages/Master/Customer group/CustomerGroup";
import ProductCategory from "pages/Master/Product Category/ProductCategory";
import UOM from "pages/Master/UOM/UOM";
import DeliveryPattern from "pages/Master/Delivery Pattern/DeliveryPattern";
import EditProductCategory from "pages/Master/Product Category/EditProductCategory";
import EditUOM from "pages/Master/UOM/EditUOM";
import EditDeliveryPattern from "pages/Master/Delivery Pattern/EditDeliveryPattern";
import EditCustomerGroup from "pages/Master/Customer group/EditCustomerGroup";
import Farm from "pages/Farm/Farm";
import Cwh from "pages/CWH/Cwh";
import Apicalls from "customhooks/apicalls/Apicalls";
import Hublist from "pages/Hub/Hub master/Hublist";
import DeliveryLogs from "pages/Hub/DeliveryBoyLogs/DeliveryLogs";
import CollectionSummeryHub from "pages/Hub/Collection summery/CollectionSummeryHub";
import CustomerList from "pages/Customers/CustomersList/CustomerList";
// import WalletDetails from "pages/Customers/WalletDetails";
import BottleManagement from "pages/Customers/Bottle management/BottleManagement";
import Products from "pages/Products/Products";
import SubscriptionConfig from "pages/Subscription/SubscriptionConfig";
import CartOrders from "pages/Orders/CartOrders/CartOrders";
import SubscriptionOrders from "pages/Orders/SubscriptionOrders/SubscriptionOrdersHome";
import RoleAndPermissions from "pages/Role-&-Permissions/RoleAndPermissions";
import Indent from "pages/Inventory/Indent/Indent";
import Outward from "pages/Inventory/Outward/Outward";
import ReturnStock from "pages/Inventory/ReturnStock/ReturnStock";
import StockSummery from "pages/Inventory/StockSummery/StockSummery";
import StockTransferred from "pages/Inventory/StockTransferred/StockTransferred";
import Invoices from "pages/Accounts/Invoices/Invoices";
import PaymentTransactions from "pages/Accounts/PaymentTransactions/PaymentTransactions";
import CollectionSummery from "pages/Accounts/CollectionSummery/CollectionSummery";
import PendingTransaction from "pages/Accounts/PendingTransaction/PendingTransaction";
import CompanyDetails from "pages/Other/company Details/CompanyDetails";
import TermsAndConditions from "pages/Other/Terms and conditions/TermsAndConditions";
import HTMLSection from "pages/Other/Html section/HTMLSection";
import Offers from "pages/Offers/Offers";
import Tickets from "pages/Other/Tickets/Tickets";
import AddRolesAndPermission from "pages/Role-&-Permissions/AddRolesAndPermission";
import EditRoleAndPermission from "pages/Role-&-Permissions/EditRoleAndPermission";
import { AreaChart } from "recharts";
import AreaEchart from "pages/Master/Area/AreaEchart";
import EditUsers from "pages/Master/Users/EditUsers";
import AddUsers from "pages/Master/Users/AddUsers";
import AddFarm from "pages/Farm/AddFarm";
import AddCwh from "pages/CWH/AddCwh";
import EditCwh from "pages/CWH/EditCwh";
import EditFarm from "pages/Farm/EditFarm";
// import DepartmentType from "pages/Master/Department Type/DepartmentType";
// import AddDepartmentType from "pages/Master/Department Type/AddDepartmentType";
// import EditDepartmentType from "pages/Master/Department Type/EditDepartmentType";
import AddDeliveryBoy from "pages/Master/Delivery Boy/AddDeliveryBoy";
import EditDeliveryBoy from "pages/Master/Delivery Boy/EditDeliveryBoy";
import DeliveryBoViewDetails from "pages/Master/Delivery Boy/DeliveryBoViewDetails";
import AddHubList from "pages/Hub/Hub master/AddHubList";
import EditHublist from "pages/Hub/Hub master/EditHublist";
import AddProducts from "pages/Products/AddProducts";
import ProductView from "pages/Products/ProductView";
import EditProducts from "pages/Products/EditProducts";
import CreateOffers from "pages/Offers/CreateOffers";
import EditCompanyDetails from "pages/Other/company Details/EditCompanyDetails";
import EditHtmlSection from "pages/Other/Html section/EditHtmlSection";
import AddCustomers from "pages/Customers/CustomersList/AddCustomers";
import HubDetails from "pages/Hub/Hub master/HubDetails";
import IndentDetailViewById from "pages/Inventory/Indent/IndentDetailViewById";

// import City from "../pages/Master/City/City"
// import Pincode from "../pages/Master/Pincode/Pincode"
// import Area from "../pages/Master/Area/Area"
// import Users from "../pages/Master/Users/Users"

//Milkmor Ecommerce

//Home Page
import HomePage from "../pages/MilkmorEcommerce/HomePage/homePage";

//Products Page
import ProductsHome from "pages/MilkmorEcommerce/ProductsHome/productsHome";
import ProductsShop from "pages/MilkmorEcommerce/ProductsShop/productsShop";

//Delivery Areas
import DeliveryAreas from "pages/MilkmorEcommerce/DeliveryAreas/deliveryAreas";
// import OurFarm from "pages/MilkmorEcommerce/OurFarm/OurFarm";
// import EBlogList from "pages/MilkmorEcommerce/MilkMorning/Blogs/EBlogList";
// import Happenings from "pages/MilkmorEcommerce/MilkMorning/Happenings/Happenings";
import Directors from "pages/MilkmorEcommerce/Directors/Directors";
import Downloads from "pages/MilkmorEcommerce/Downloads/Downloads";
import Recipe from "pages/MilkmorEcommerce/Recipe/Recipe";
import CustomerDetail from "pages/Customers/CustomersList/CustomerDetail";
import EditCustomer from "pages/Customers/CustomersList/EditCustomer";
import SubscriptionDuration from "pages/Subscription/SubscriptionDuration";
import SubscriptionDeliveryPattern from "pages/Subscription/SubscriptionDeliveryPattern";
import AddSubscriptionOrders from "pages/Orders/SubscriptionOrders/AddSubscriptionOrders";
import SubscriptionCart from "pages/MilkmorEcommerce/SubscriptionCart/SubscriptionCart";
import MilkmorUserProfile from "pages/MilkmorEcommerce/MilkmorUserProfile/MilkmorUserProfile";
import CartOrderList from "pages/MilkmorEcommerce/CartOrderList/CartOrderList";
import MySubscription from "pages/MilkmorEcommerce/MySubscriptions/MySubscriptions";
import RechargeHistory from "pages/MilkmorEcommerce/RechargeHistory/RechargeHistory";
import EcommerceTickets from "pages/MilkmorEcommerce/EcommerceTickets/EcommerceTickets";
import UserWalletDetails from "pages/MilkmorEcommerce/UserWalletDetails/UserWalletDetails";
import Checkout from "pages/MilkmorEcommerce/Checkout/Checkout";
import MilkmorOutlets from "pages/MilkmorEcommerce/MilkmorOutlets/MilkmorOutlets";
import Career from "pages/MilkmorEcommerce/Career/Career";
import CartOrder from "pages/MilkmorEcommerce/CartOrder/CartOrder";
import ViewSubscriptionOrders from "pages/Orders/SubscriptionOrders/ViewSubscriptionOrders";
import DeliveryLogsById from "pages/Hub/DeliveryBoyLogs/DeliveryLogsById";
import CreateIndent from "pages/Inventory/Indent/CreateIndent";
// import InwardDetailsById from "pages/Inventory/Stock/StockDetailsById";
import Stock from "pages/Inventory/Stock/Stock";
import StockDetailsById from "pages/Inventory/Stock/StockDetailsById";
import EditSubscriptionOrders from "pages/Orders/SubscriptionOrders/EditSubscriptionOrders";
import CartOrderDetailsById from "pages/Orders/CartOrders/CartOrderDetailsById";
import CartOrderCheckout from "pages/MilkmorEcommerce/CartOrderCheckout/CartOrderCheckout";
import OrderSuccess from "pages/MilkmorEcommerce/OrderSuccessPage/OrderSuccess";
import CartOrderListDetaiedView from "pages/MilkmorEcommerce/CartOrderListDetailedView/CartOrderListDetailedView";
import SubscriptionOrderDetailedView from "pages/MilkmorEcommerce/SubscriptionOrderDetailedView/SubscriptionOrderDetailedView";
import PrintCartOrderInvoice from "pages/MilkmorEcommerce/PrintCartOrderInvoice/PrintCartOrderInvoice";
import BlockedTransactions from "pages/MilkmorEcommerce/BlockedTransactions/BlockedTransaction";
import RechargeWallet from "pages/MilkmorEcommerce/RechargeWallet/RechargeWallet";
import WalletTransactionHistory from "pages/MilkmorEcommerce/WalletTransactionHistory/WalletTransactionHistory";
import CustomerDeliveryLogs from "pages/MilkmorEcommerce/CustomerDeliveryLogs/CustomerDeliveryLogs";
import TrailOrderCart from "pages/MilkmorEcommerce/TrailOrdersCart/TrailOrderCart";
import CheckoutTrail from "pages/MilkmorEcommerce/CheckoutTrail/CheckoutTrail";
import EditSubscriptionOrder from "pages/MilkmorEcommerce/EditSubscriptionOrder/EditSubscriptionOrder";
import LoginPage from "pages/MilkmorEcommerce/LoginPage/LoginPage";
import SignupPage from "pages/MilkmorEcommerce/SignupPage/SignupPage";
import WalletDetails from "pages/Customers/Wallet details/WalletDetails";
import WalletOrderTransactionDetails from "pages/Customers/Wallet details/WalletOrderTransactionDetails";
import SchedularSettings from "pages/Schedular Settings/SchedularSettings";
import OutwardDetailByOutwrdNo from "pages/Inventory/Outward/OutwardDetailByIndentNo";
import OutwardDetailByIndentNo from "pages/Inventory/Outward/OutwardDetailByIndentNo";
import DashBoardHome from "pages/Dashboard/DashBoardHome";
import Inward from "pages/Inventory/Inward/Inward";
import CreateInward from "pages/Inventory/Inward/CreateInward";
import ProductDetailedViewPage from "pages/MilkmorEcommerce/ProductDetailedViewPage/ProductDetailedViewPage";
import NotificationTaskManager from "pages/NotificationTaskManager/NotificationTaskManager";
// import CartOrder from "pages/MilkmorEcommerce/CartOrder/CartOrder";

//Milkmor Ecommerce

const authProtectedRoutes = [
  // <PrivateRoute path="/dashboard" element={<Dashboard />} />,
  // <PrivateRoute path="/dashboard" element={<Dashboard />} />

  {
    path: "/dashboard",
    component: <DashBoardHome />,
    module_name: "Dashboard",
    method_name: "view",
  },

  { path: "/dashboard-saas", component: <DashboardSaas /> },
  { path: "/dashboard-job", component: <DashboardJob /> },

  // Schedular Settings-----------------------------
  { path: "/schedular-settings", component: <SchedularSettings /> },
  // Master Routes start -----------------------------

  //City
  { path: "/master-city", component: <City /> },
  { path: "/master-city-edit/:id", component: <EditCity /> },

  // Pincode
  { path: "/master-pincode", component: <Pincode /> },
  { path: "/master-pincode-edit/:id", component: <Pincode /> },

  //Area
  { path: "/master-area", component: <Area /> },
  { path: "/master-area-echart", component: <AreaEchart /> },
  { path: "/master-area-edit/:id", component: <Area /> },

  // Delivery Boys
  { path: "/master-delivery-boys", component: <DeliveryBoy /> },
  { path: "/master-add-delivery-boys", component: <AddDeliveryBoy /> },
  { path: "/master-delivery-boys/:id", component: <EditDeliveryBoy /> },
  {
    path: "/master-delivery-boys-view/:id",
    component: <DeliveryBoViewDetails />,
  },
  // { path: "/master-hsn-code", component: <EditHsnCode /> },

  // Department Names

  // { path: "/master-department", component: <DepartmentType /> },
  // { path: "/master-add-department", component: <AddDepartmentType /> },
  // { path: "/master-department-edit/:id", component: <EditDepartmentType /> },

  // User
  { path: "/master-users", component: <Users /> },
  { path: "/master-add-users", component: <AddUsers /> },
  { path: "/master-users-edit/:id", component: <EditUsers /> },

  // Customer Group
  { path: "/master-customer-group", component: <CustomerGroup /> },
  { path: "/master-customer-group/:id", component: <EditCustomerGroup /> },

  // Product Category
  { path: "/master-Product-category", component: <ProductCategory /> },
  {
    path: "/master-Product-category-edit/:id",
    component: <EditProductCategory />,
  },

  // UOM
  { path: "/master-uom", component: <UOM /> },
  { path: "/master-uom-edit/:id", component: <EditUOM /> },

  // Tax Rate
  { path: "/master-tax-rate", component: <TaxRate /> },
  { path: "/master-tax-rate-edit/:id", component: <EditTaxRate /> },

  // Hns Code
  { path: "/master-hsn-code", component: <HsnCode /> },
  { path: "/master-hsn-code-edit/:id", component: <EditHsnCode /> },

  // Delivery Pattern
  { path: "/master-delivery-pattern", component: <DeliveryPattern /> },
  {
    path: "/master-delivery-pattern-edit/:id",
    component: <EditDeliveryPattern />,
  },

  //  master Routes End -----------------------------

  // Farm
  {
    path: "/farm-home",
    component: <Farm />,
    module_name: "Farm",
    method_name: "view",
  },
  {
    path: "/farm-add",
    component: <AddFarm />,
    module_name: "Farm",
    method_name: "create",
  },
  {
    path: "/farm-edit/:id",
    component: <EditFarm />,
    module_name: "Farm",
    method_name: "edit",
  },

  // CWH
  { path: "/cwh-home", component: <Cwh /> ,
  module_name: "CWH",
  method_name: "view",
},
  { path: "/cwh-add", component: <AddCwh /> ,
  module_name: "CWH",
  method_name: "create",},
  { path: "/cwh-edit/:id", component: <EditCwh />,
  module_name: "CWH",
  method_name: "edit", },

  // HUB
  { path: "/hub-list", component: <Hublist /> },
  { path: "/hub-details/:id", component: <HubDetails /> },
  { path: "/hub-list-add", component: <AddHubList /> },
  { path: "/hub-list-edit/:id", component: <EditHublist /> },

  //
  { path: "/delivery-logs", component: <DeliveryLogs /> },
  { path: "/delivery-logs/:id", component: <DeliveryLogsById /> },
  { path: "/hub-collection-summary", component: <CollectionSummeryHub /> },

  // CUSTOMERS

  { path: "/add-customer", component: <AddCustomers /> },
  { path: "/customer-list", component: <CustomerList /> },
  { path: "/customer-detail/:id", component: <CustomerDetail /> },
  { path: "/customer-edit/:id", component: <EditCustomer /> },

  { path: "/wallet-details", component: <WalletDetails /> },
  {
    path: "/dashboard-wallet-order-transactions",
    component: <WalletOrderTransactionDetails />,
  },
  { path: "/bottle-management", component: <BottleManagement /> },

  // PRODUCTS
  { path: "/products", component: <Products />  ,
  module_name: "Products",
  method_name: "view",},
  { path: "/products-add", component: <AddProducts />   ,
  module_name: "Products",
  method_name: "create",},
  { path: "/products-view/:id", component: <ProductView /> ,
  module_name: "Products",
  method_name: "view",},
  { path: "/products-edit/:id", component: <EditProducts />  ,
  module_name: "Products",
  method_name: "edit",},

  // Subscription
  { path: "/subscription-config", component: <SubscriptionConfig /> },
  { path: "/subscription-duration", component: <SubscriptionDuration /> },
  {
    path: "/subscription-delivery-pattern",
    component: <SubscriptionDeliveryPattern />,
  },

  // ORDERS
  { path: "/cart-orders-view/:id", component: <CartOrderDetailsById /> },
  { path: "/cart-orders", component: <CartOrders /> },
  { path: "/subscription-orders", component: <SubscriptionOrders /> },
  { path: "/subscription-orders-add", component: <AddSubscriptionOrders /> },
  {
    path: "/subscription-orders-view/:id",
    component: <ViewSubscriptionOrders />,
  },
  {
    path: "/subscription-orders-Edit/:id",
    component: <EditSubscriptionOrders />,
  },

  // ROLE & PERMISSIONS
  { path: "/role-&-permissions", component: <RoleAndPermissions />  ,
  module_name: "Role & Permissions",
  method_name: "view",},

  { path: "/add-role-&-permissions", component: <AddRolesAndPermission />   ,
  module_name: "Role & Permissions",
  method_name: "create",},
  {
    path: "/edit-role-&-permissions/:id",
    component: <EditRoleAndPermission /> ,
    module_name: "Role & Permissions",
    method_name: "edit",},
    

  //INVENTORY

  //Notification Task Manger

  { path: "/notification-task-manager", component: <NotificationTaskManager/> },

  // Indent
  { path: "/indent", component: <Indent /> },
  { path: "/indent-create", component: <CreateIndent /> },
  { path: "/inward", component: <Inward /> },
  { path: "/inward-create", component: <CreateInward /> },
  { path: "/indent-detail/:id", component: <IndentDetailViewById /> },
  { path: "/stock", component: <Stock /> },
  { path: "/stock-detail/:id", component: <StockDetailsById /> },
  { path: "/outward", component: <Outward /> },
  { path: "/outward-detail/:id", component: <OutwardDetailByIndentNo /> },
  { path: "/returun-stock", component: <ReturnStock /> },
  { path: "/stock-summery", component: <StockSummery /> },
  { path: "/stock-transferred", component: <StockTransferred /> },

  //ACCOUNTS
  { path: "/invoices", component: <Invoices /> },
  { path: "/payment-transactios", component: <PaymentTransactions /> },
  { path: "/collection-summary", component: <CollectionSummery /> },
  { path: "/pending-transaction", component: <PendingTransaction /> },

  ////////////////////// OTHER

  // Company Details
  { path: "/company-details", component: <CompanyDetails /> },
  { path: "/company-details-edit/:id", component: <EditCompanyDetails /> },

  { path: "/tickets", component: <Tickets /> },
  { path: "/terms-&-conditions", component: <TermsAndConditions /> },

  // Html Section
  { path: "/html-section", component: <HTMLSection /> },
  { path: "/html-section-edit/:id", component: <EditHtmlSection /> },

  // OFFERS
  { path: "/offers", component: <Offers />,
  module_name: "Offers",
  method_name: "view",},

  { path: "/offers-add", component: <CreateOffers /> ,
  module_name: "Offers",
  method_name: "create",},

  // //profile
  { path: "/profile", component: <UserProfile /> },
  // // Custom Hookk
  { path: "/customhook", component: <Apicalls /> },

  //Charts
  // { path: "/apex-charts", component: <ChartApex /> },
  // { path: "/chartist-charts", component: <ChartistChart /> },
  // { path: "/chartjs-charts", component: <ChartjsChart /> },
  // { path: "/e-charts", component: <EChart /> },
  // { path: "/sparkline-charts", component: <SparklineChart /> },
  // { path: "/charts-knob", component: <ChartsKnob /> },
  // { path: "/re-charts", component: <ReCharts /> },

  // Icons
  // { path: "/icons-boxicons", component: <IconBoxicons /> },
  // { path: "/icons-dripicons", component: <IconDripicons /> },
  // { path: "/icons-materialdesign", component: <IconMaterialdesign /> },
  // { path: "/icons-fontawesome", component: <IconFontawesome /> },

  // Tables
  // { path: "/tables-basic", component: <BasicTables /> },
  // { path: "/tables-datatable", component: <DatatableTables /> },
  // { path: "/tables-responsive", component: <ResponsiveTables /> },
  // { path: "/tables-dragndrop", component: <DragDropTables /> },

  // Maps
  // { path: "/maps-google", component: <MapsGoogle /> },
  // { path: "/maps-vector", component: <MapsVector /> },
  // { path: "/maps-leaflet", component: <MapsLeaflet /> },

  // Forms
  // { path: "/form-elements", component: <FormElements /> },
  // { path: "/form-layouts", component: <FormLayouts /> },
  // { path: "/form-advanced", component: <FormAdvanced /> },
  // { path: "/form-editors", component: <FormEditors /> },
  // { path: "/form-mask", component: <FormMask /> },
  // { path: "/form-repeater", component: <FormRepeater /> },
  // { path: "/form-uploads", component: <FormUpload /> },
  // { path: "/form-wizard", component: <FormWizard /> },
  // { path: "/form-validation", component: <FormValidations /> },

  // Ui
  // { path: "/ui-alerts", component: <UiAlert /> },
  // { path: "/ui-buttons", component: <UiButtons /> },
  // { path: "/ui-cards", component: <UiCards /> },
  // { path: "/ui-carousel", component: <UiCarousel /> },
  // { path: "/ui-colors", component: <UiColors /> },Forms
  // { path: "/ui-dropdowns", component: <UiDropdown /> },
  // { path: "/ui-general", component: <UiGeneral /> },
  // { path: "/ui-grid", component: <UiGrid /> },
  // { path: "/ui-images", component: <UiImages /> },
  // { path: "/ui-lightbox", component: <UiLightbox /> },
  // { path: "/ui-modals", component: <UiModal /> },
  // { path: "/ui-progressbars", component: <UiProgressbar /> },
  // { path: "/ui-tabs-accordions", component: <UiTabsAccordions /> },
  // { path: "/ui-typography", component: <UiTypography /> },
  // { path: "/ui-video", component: <UiVideo /> },
  // { path: "/ui-session-timeout", component: <UiSessionTimeout /> },
  // { path: "/ui-rating", component: <UiRating /> },
  // { path: "/ui-rangeslider", component: <UiRangeSlider /> },
  // { path: "/ui-notifications", component: <UiNotifications /> },
  // { path: "/ui-offcanvas", component: <UiOffCanvas /> },
  // { path: "/ui-utilities", component: <UiUtilitie /> },
  // { path: "/ui-placeholders", component: <UiPlaceholders /> },
  // { path: "/ui-toasts", component: <UiToasts /> },

  //Utility
  // { path: "/pages-starter", component: <PagesStarter /> },
  // { path: "/pages-timeline", component: <PagesTimeline /> },
  // { path: "/pages-faqs", component: <PagesFaqs /> },
  // { path: "/pages-pricing", component: <PagesPricing /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  { path: "/", component: <ProductsHome /> },
  { path: "/products-home", component: <ProductsHome /> },
  { path: "/products-shop", component: <ProductsShop /> },
  { path: "/milkmor-delivery-areas", component: <DeliveryAreas /> },
  { path: "/directors", component: <Directors /> },
  { path: "/downloads", component: <Downloads /> },
  { path: "/recipe", component: <Recipe /> },
  { path: "/career", component: <Career /> },
  { path: "/product-detailed-view", component: <ProductDetailedViewPage/> },

  { path: "/customer-login", component: <LoginPage /> },
  { path: "/customer-register", component: <SignupPage /> },
  // Our Farm
  // { path: "/farm-fresh-story", component: <OurFarm /> },
  // Outlets
  { path: "/milkmor-outlets", component: <MilkmorOutlets /> },

  // MilkMorning
  // { path: "/eblogs-list", component: <EBlogList /> },
  // { path: "/happenings", component: <Happenings /> },

  { path: "/logout", component: <Logout /> },
  { path: "/admin-login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: "/forgetpasswordotp", component: <ForgetPasswordOTP /> },
  { path: "/changePassword", component: <ChangePassword /> },

  // { path: "/pages-maintenance", component: <PagesMaintenance /> },
  // { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  // { path: "/pages-404", component: <Pages404 /> },
  // { path: "/pages-500", component: <Pages500 /> },

  // Authentication Inner
  // { path: "/pages-login", component: <Login1 /> },
  // { path: "/pages-login-2", component: <Login2 /> },
  // { path: "/pages-register", component: <Register1 /> },
  // { path: "/pages-register-2", component: <Register2 /> },
  // { path: "/page-recoverpw", component: <Recoverpw /> },
  // { path: "/page-recoverpw-2", component: <Recoverpw2 /> },
  // { path: "/pages-forgot-pwd", component: <ForgetPwd1 /> },
  // { path: "/auth-recoverpw-2", component: <ForgetPwd2 /> },
  // { path: "/auth-lock-screen", component: <LockScreen /> },
  // { path: "/auth-lock-screen-2", component: <LockScreen2 /> },
  // { path: "/page-confirm-mail", component: <ConfirmMail /> },
  // { path: "/page-confirm-mail-2", component: <ConfirmMail2 /> },

  // { path: "/auth-two-step-verification", component: <TwostepVerification /> },
  // { path: "/", component: <Pages404 /> },
  // { path: "/milkmor", component: <Pages500 /> },

  // {
  //   path: "/auth-two-step-verification-2",
  //   component: <TwostepVerification2 />,
  // },
];

const eCommerceProtectedRoutes = [
  { path: "/cart-order", component: <CartOrder /> },
  { path: "/subscription-cart", component: <SubscriptionCart /> },
  { path: "/milkmor-user-profile", component: <MilkmorUserProfile /> },
  { path: "/cart-order-list", component: <CartOrderList /> },
  { path: "/my-subscriptions", component: <MySubscription /> },
  { path: "/recharge-history", component: <RechargeHistory /> },
  { path: "/ecommerce-tickets", component: <EcommerceTickets /> },
  { path: "/my-wallet-details", component: <UserWalletDetails /> },
  { path: "/checkout", component: <Checkout /> },
  { path: "/cart-order-checkout", component: <CartOrderCheckout /> },
  { path: "/order-placed-successfully", component: <OrderSuccess /> },
  {
    path: "/cart-order-list-detailed-view/",
    component: <CartOrderListDetaiedView />,
  },
  {
    path: "/subscription-order-list-detailed-view/",
    component: <SubscriptionOrderDetailedView />,
  },
  { path: "/print-cart-order-invoice", component: <PrintCartOrderInvoice /> },
  { path: "/blocked-transaction-history", component: <BlockedTransactions /> },
  { path: "/recharge-wallet", component: <RechargeWallet /> },
  {
    path: "/wallet-transaction-history",
    component: <WalletTransactionHistory />,
  },
  { path: "/customer-delivery-logs", component: <CustomerDeliveryLogs /> },
  { path: "/trail-order-cart", component: <TrailOrderCart /> },
  { path: "/checkout-trail", component: <CheckoutTrail /> },
  { path: "/edit-subscription-orders", component: <EditSubscriptionOrder /> },
];
export { authProtectedRoutes, publicRoutes, eCommerceProtectedRoutes };
