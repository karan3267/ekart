import React from "react";
import { Link } from "react-router-dom";
import CartIcon from "./CartIcon";

const Header = () => {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="text-gray-600">Welcome, Admin!</div>
      <div className="hover:gray-600 w-16 h-16">
        <Link to="/cart" className="flex w-full h-full">
          <CartIcon />
        </Link>
      </div>
    </div>
  );
};

export default Header;
