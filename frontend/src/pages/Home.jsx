import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featuredProducts = products.filter((product) => product.isFeatured);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            // <div
            //   key={product._id}
            //   className="border rounded-lg shadow-md hover:shadow-lg overflow-hidden"
            // >
            //   <img
            //     src={product.images[0]}
            //     alt={product.name}
            //     className="w-full h-48 object-cover"
            //   />
            //   <div className="p-4">
            //     <h2 className="text-lg font-bold">{product.name}</h2>
            //     <p className="text-sm text-gray-500">{product.description}</p>
            //     <p className="text-xl font-bold mt-2">${product.price}</p>
            //     <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            //       Add to Cart
            //     </button>
            //   </div>
            // </div>
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
