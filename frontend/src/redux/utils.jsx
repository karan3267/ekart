import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  ispaymentGatewayOpen: false,
  isSideBarOpen: false,
  isTokenExpired: true,
};
const time = Date.now() / 1000;
const utils = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setIsPaymentGatewayOpenFalse(state) {
      state.ispaymentGatewayOpen = false;
    },
    setIsPaymentGatewayOpenTrue(state) {
      state.ispaymentGatewayOpen = true;
    },
    setIsSideBarOpen(state) {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
    tokenExpired(state) {
      const token = localStorage.getItem("token");
      if(token){
        const decoded = jwtDecode(token);
        state.isTokenExpired = decoded.exp < time;
      }else{
        state.isTokenExpired =true;
      }
    },
  },
});
export const { setIsPaymentGatewayOpenTrue,setIsPaymentGatewayOpenFalse, setIsSideBarOpen, tokenExpired } =
  utils.actions;
export default utils.reducer;
