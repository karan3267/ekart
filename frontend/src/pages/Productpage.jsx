import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { addToCart } from "../redux/cartSlice";
import { fetchProduct } from "../redux/productSlice";
import { fetchCategories } from "../redux/categorySlice";
import SuccessAnimation from "../components/SuccessAnimation";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector((state) => state.products.product);
  const categories = useSelector((state) => state.category);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productAddedToCart, setIsProductAddedToCart] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
    dispatch(fetchCategories());
  }, [dispatch, id]);

  const categoryName = useMemo(() => {
    const category = categories.category.find(
      (cat) => cat._id === product?.category
    );
    return category ? category.name : "Unknown Category";
  }, [categories.category, product]);

  if (!product) {
    return <div className="p-6">Product not found.</div>;
  }

  const handleAddToCart = () => {
    if (localStorage.getItem("token")) {
      dispatch(addToCart(product));
      setIsProductAddedToCart(true);
      setTimeout(() => {
        setIsProductAddedToCart(false);
      }, 3000);
    } else {
      navigate("/login");
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % product.images.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.images.length) % product.images.length
    );
  };

  return (
    <div className="p-6 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2">
        <div className="relative border rounded-lg shadow-md bg-white">
          <img
            src={
              product.images[currentImageIndex]
                ? product.images[currentImageIndex]
                : "default_product.png"
            }
            alt={product.name}
            className="w-full h-96 object-contain p-4"
            loading="lazy"
          />
          <button
            onClick={handlePrevImage}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-600 bg-white p-2 rounded-full shadow hover:bg-gray-200"
          >
            &lt;
          </button>
          <button
            onClick={handleNextImage}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600 bg-white p-2 rounded-full shadow hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>

        {/* Thumbnail Previews */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index}`}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                currentImageIndex === index
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
        <p className="text-sm text-gray-500 mt-1">Category: {categoryName}</p>
        <p className="text-xl font-bold text-green-600 mt-4">
          ${product.price}
        </p>
        <p className="mt-4 text-gray-700">{product.description}</p>
        <p className="mt-2 text-gray-600">Ratings: {product.ratings.average}</p>
        <button
          onClick={handleAddToCart}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Add to Cart
        </button>
        {productAddedToCart && (
          <SuccessAnimation
            header={"Success!"}
            text={`Successfully added ${product.name} to the cart!`}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
