// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // ใช้ localStorage

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

// ใช้ persistReducer ในการห่อ rootReducer เพื่อให้การจัดเก็บสามารถถูกเพอร์ซิสต์ได้
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  // เปลี่ยนจากใช้ persistedReducer แทนที่ userReducer ใน reducer หลัก
  reducer: persistedReducer,
  // ย้ายการตั้งค่า middleware ออกมาเพื่อให้ถูกต้อง
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// เพิ่ม persistor เพื่อใช้กับ persistStore
export const persistor = persistStore(store);

export default store;
