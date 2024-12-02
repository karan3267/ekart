import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Login";
import { useEffect } from "react";
import { tokenExpired } from "../redux/utils";

const PrivateRoute = ({ element, adminOnly}) => {
  const { user} = useSelector((state) => state.auth);
  const {isTokenExpired}=useSelector((state)=>state.utils);
  const dispatch=useDispatch();

  const navigate=useNavigate();
  useEffect(()=>{
    dispatch(tokenExpired());
  },[dispatch,isTokenExpired]);
  if (isTokenExpired) {
    element=<Login/>
  }

  if (adminOnly && !user?.isAdmin) {
    navigate("/products");
  }

  return element;
};

export default PrivateRoute;
