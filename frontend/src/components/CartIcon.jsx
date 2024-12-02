import { useSelector } from "react-redux";
// import cart from '../assets/cart.png';

const CartIcon = () => {
  const cart = useSelector((state) => state.cart);
  const itemCount = cart.items.length;
  return (
    <div className="relative rounded-full border-2 p-2 w-full h-full object-contain content-center justify-items-center">
      <img src={'cart.png'} width={"28px"} alt="cart-logo" />
      <div>
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white font-bold rounded-full px-2 py-1 text-xs">
            {itemCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default CartIcon;
