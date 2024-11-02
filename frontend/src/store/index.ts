// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import notebookReducer from './notebookSlice';
import noteSlice from "./noteSlice";
import notesourceSlice from "./notesourceSlice";
// import userReducer from './userSlice.ts';


const rootReducer = combineReducers({
    // user: userReducer,
    notebook: notebookReducer,
    note: noteSlice,
    notesource: notesourceSlice,
});


const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
});


export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
