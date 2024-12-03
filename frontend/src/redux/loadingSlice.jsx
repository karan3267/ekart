import { createSlice } from "@reduxjs/toolkit"

const initialState={
    isLoading:false
}
const loadingSlice=createSlice({
    name:'loading',
    initialState,
    reducers:{
        setLoader:(state,action)=>{
            state.isLoading=action.payload
        }
    }
})
export const {setLoader}=loadingSlice.actions;
export default loadingSlice.reducer;