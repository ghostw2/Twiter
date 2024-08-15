import { configureStore } from '@reduxjs/toolkit';
import  authReducer  from '../feature/auth/AuthSlice'
const store = configureStore({
    reducer: {
        auth:authReducer
    }
})

export default store