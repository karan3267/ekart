import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/cartSlice";
import { setIsSideBarOpen } from "../redux/utils";
import { logout } from "../redux/authSlice";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const auth = useSelector((state) => state.auth);
  const utils = useSelector((state) => state.utils);
  const items = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOpen = utils.isSideBarOpen;
  const modalRef = useRef();

  const isTokenExpired = () => {
    const token = localStorage.getItem("token");
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  useEffect(() => {
    if (auth.user && !isTokenExpired()) {
      dispatch(fetchCart(auth.user.id));
    } else if (!auth.user || isTokenExpired()) {
      localStorage.clear();
      navigate("/login");
    }

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [auth.user, dispatch, navigate]);

  const handleProfileClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleOrdersClick = () => {
    navigate("/orders");
  };

  const toggleSidebar = () => {
    dispatch(setIsSideBarOpen());
  };

  const handleSignout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-md text-white">
      {/* Main Header */}
      <div className="p-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/">
          <img
            src={"logo2.png"}
            alt="eKart Logo"
            className="w-20 h-20 object-cover rounded-full"
          />
        </NavLink>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 rounded-lg w-64 border-none shadow-md focus:outline-none text-gray-700"
          />

          {/* Cart Icon */}
          <button onClick={handleCartClick} className="relative group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="white"
              className="w-8 h-8 group-hover:stroke-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2m0 0l3.6 10m1.8 0h7.6l3.6-10m-16 0H1m17 0h4m-7 13a1 1 0 11-2 0 1 1 0 012 0zm-6 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs font-bold text-white w-5 h-5 rounded-full flex items-center justify-center">
              {items !== null && items !== undefined
                ? items.reduce((total, item) => total + item.quantity, 0)
                : 0}
            </span>
          </button>

          {/* Orders */}
          <button
            onClick={handleOrdersClick}
            className="hover:underline text-white"
          >
            My Orders
          </button>

          {/* Profile */}
          <div className="relative">
            <img
              onClick={handleProfileClick}
              src={"user.png"}
              alt="User"
              className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80"
            />
            {isModalOpen && (
              <div
                ref={modalRef}
                className="absolute right-0 mt-4 z-10 bg-white text-gray-800 divide-y divide-gray-100 rounded-lg shadow-md w-48"
              >
                <div className="px-4 py-3">
                  <p>{auth.user?.name || "Guest User"}</p>
                  <p className="text-sm text-gray-500">
                    {auth.user?.email || "guest@example.com"}
                  </p>
                </div>
                <ul className="py-2">
                  <li>
                    <NavLink
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Settings
                    </NavLink>
                  </li>
                </ul>
                {auth.user && (
                  <div className="py-1">
                    <button
                      onClick={handleSignout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub Header */}
      <div className="bg-blue-500 py-2 px-4 flex items-center justify-between text-sm">
        {/* Sidebar Toggle */}
        <button onClick={toggleSidebar} className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span className="ml-2">Menu</span>
        </button>

        {/* Navigation Links */}
        <nav className="flex gap-6">
          <NavLink to="/products" className="hover:underline">
            Products
          </NavLink>
          <NavLink to="/categories" className="hover:underline">
            Categories
          </NavLink>
          <NavLink to="/about" className="hover:underline">
            About Us
          </NavLink>
          <NavLink to="/contact" className="hover:underline">
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
