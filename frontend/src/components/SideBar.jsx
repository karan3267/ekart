import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate=useNavigate();
  const handleClick=()=>{
    navigate("/");
  }
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 hover:cursor-pointer" onClick={handleClick}>eKart</h2>
      <nav>
        <Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded">
          Products
        </Link>
        <Link to="/orders" className="block py-2 px-4 hover:bg-gray-700 rounded">
          Orders
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
