// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
// import userReducer from './userSlice.ts';


const rootReducer = combineReducers({
    // user: userReducer,
});


const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});


export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
