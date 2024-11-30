import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { useDispatch } from "react-redux";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = () => {
    navigate(`product/${product.id}`);
  };
  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:cursor-pointer">
      <div onClick={handleClick}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain"
        />
      </div>
      <div className="p-4">
        <div onClick={handleClick}>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600 text-sm">{product.description}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-blue-600">
            ${product.price}
          </span>
          <button
            className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
