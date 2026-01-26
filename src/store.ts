import type { Action } from "@redux/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./createSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
    }
})

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];