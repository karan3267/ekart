import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { products } from "../assets/data";
import { setProduct } from "../redux/paymentSlice";
import { addToCart } from "../redux/cartSlice";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = products.find((prod) => prod.id === id);

  if (!product) {
    return <div className="p-6">Product not found.</div>;
  }

  const handleAddToCart=()=>{
    dispatch(addToCart(product));
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-96 object-cover"
        />
        <div className="md:ml-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500">{product.category}</p>
          <p className="text-xl font-bold mt-2">${product.price}</p>
          <p className="mt-4">{product.description}</p>
          <button
            onClick={handleAddToCart}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
