import { createSlice } from "@reduxjs/toolkit";

const initialState={
    ispaymentGatewayOpen:false
}

const utils=createSlice({
name:'utils',
initialState,
reducers:{
    setIsPaymentGatewayOpen(state){
        state.ispaymentGatewayOpen=!state.ispaymentGatewayOpen;
    }
}
})
export const {setIsPaymentGatewayOpen}=utils.actions;
export default utils.reducer;