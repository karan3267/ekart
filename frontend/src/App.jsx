import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProductPage from "./pages/Productpage";
import CheckOut from "./pages/CheckOut";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Cart from "./pages/Cart";
import PaymentPage from "./pages/paymentPage";
import "./App.css";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const utils = useSelector((state) => state.utils);
  return (
    <Router>
      <div className="">
        {!utils.ispaymentGatewayOpen && (
          <div className="md:block w-64 hidden fixed">
            <Sidebar />
          </div>
        )}
        <div
          className={
            utils.ispaymentGatewayOpen ? "flex-grow-0" : "flex-grow-0 md:ml-64"
          }
        >
          {!utils.ispaymentGatewayOpen && <Header />}
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="cart" element={<Cart />} />
              <Route path="success" element={<Success />} />
              <Route path="cancel" element={<Cancel />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="checkout" element={<CheckOut />} />
              <Route path="payment" element={<Payment />} />
            </Route>
            <Route path="/custom-payment" element={<PaymentPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Layout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AppRoutes;
