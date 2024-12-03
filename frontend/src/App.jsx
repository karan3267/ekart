import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import ProductPage from "./pages/Productpage";
import CheckOut from "./pages/CheckOut";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Cart from "./pages/Cart";
import PaymentPage from "./pages/paymentPage";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoutes";
import Test from "./pages/test";
import "./App.css";
import Home from "./pages/Home";
import { useEffect } from "react";
import { tokenExpired } from "./redux/utils";
import Loader from "./components/Loader";

const AppRoutes = () => {
  const utils = useSelector((state) => state.utils);
  const { token } = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.loading.isLoading);

  const dipatch = useDispatch();
  useEffect(() => {
    dipatch(tokenExpired());
  }, [dipatch]);
  return (
    <Router>
      <div>
        {/* {loading && (
          <div className="fixed bg-gray-600 bg-opacity-60 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10">
            {<Loader />}
          </div>
        )} */}
        {token && !utils.isTokenExpired ? (
          <div>
            <div className="flex-grow-0">
              <Routes>
                {/* Layout with Sidebar and Header */}
                <Route path="/test" element={<Test />} />
                <Route path="/" element={<Layout />}>
                  {/* Public Routes */}
                  <Route index element={<Home />} />
                  <Route path="*" element={<Navigate to="/" />} />
                  <Route path="products" element={<Products />} />
                  <Route path="product/:id" element={<ProductPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="orders"
                    element={<PrivateRoute element={<Orders />} />}
                  />
                  <Route
                    path="cart"
                    element={<PrivateRoute element={<Cart />} />}
                  />
                  <Route
                    path="checkout"
                    element={<PrivateRoute element={<CheckOut />} />}
                  />
                  <Route
                    path="payment"
                    element={<PrivateRoute element={<Payment />} />}
                  />
                  <Route
                    path="success"
                    element={<PrivateRoute element={<Success />} />}
                  />
                  <Route
                    path="cancel"
                    element={<PrivateRoute element={<Cancel />} />}
                  />
                </Route>

                {/* Custom Payment Route */}
                <Route path="/custom-payment" element={<PaymentPage />} />
              </Routes>
            </div>
          </div>
        ) : (
          <div>
            <Routes>
              {/* Unauthenticated routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="*" element={<Home />} />
                <Route path="products" element={<Products />} />
              </Route>
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};

const Layout = () => {
  const utils = useSelector((state) => state.utils);
  return (
    <div>
      {!utils.ispaymentGatewayOpen && utils.isSideBarOpen && (
        <div className="absolute w-64 z-10">
          <Sidebar />
        </div>
      )}
      {!utils.ispaymentGatewayOpen && <Header />}
      <Outlet />
    </div>
  );
};

export default AppRoutes;
