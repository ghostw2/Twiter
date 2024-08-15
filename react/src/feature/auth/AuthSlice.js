import { createAction, createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import useAxios from "../../helpers/axiosConfig";
const backend = "http://localhost:3000";
const initalToken = localStorage.getItem('userToken') || null;
const initialState = {
    loading: false,
    userInfo: {},
    userToken: initalToken,
    error: null,
    success:false
}
export const retriveUser = createAsyncThunk('auth/retrive', async (token) => {
    const axiosInstance = axios.create({ baseURL: backend });
    axiosInstance.interceptors.request.use((config) => {
        if (initalToken) {
            config.headers.Authorization = initalToken;
        }
        return config;
    },
    (error)=> Promise.reject(error))

    return axiosInstance.post(backend + '/retrive', {
    }).then(response => {
        console.log('response from retrive'+response)
        if (response.data.success === true) {
            return response.data
        } else {
            return rejectWithValue(response.data.message)
        }
    }).catch(e => {
        console.log(e.message)
        return rejectWithValue(response.data.message)
    })
})
export const loginUser = createAsyncThunk('auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        return await axios.post(backend + "/login", {
            username: username,
            password: password
        }).then(response => {
            console.log(response)
            if (response.data.success === true) {
                
                localStorage.setItem('userToken', response.data.token);
                console.log(response.data);
                //navigate('/');
                return response.data
            }
            else {
                return rejectWithValue(response.data.message);
            }
        }).catch(error => {
                console.log(error.message);  
                return rejectWithValue(error.message)
        })
   // return await axios.post
})

export const registerUser = createAsyncThunk('auth/register', async (
    { email, username, password }, { rejectWithValue }) => {
    
    return await axios.post(backend+"/register",
        {
            email: email,
            username: username,
            password:password
        },
        {
            headers: {
            "Cache-Control": "no-cache",
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        }}
    ).then(response => {
        if (response.data.success === true) {
            console.log(response.data.user.username);
            return response.data
        }
    }).catch (error => {
        console.log(error.message);  
        return rejectWithValue(error.message)
    })
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending,(state) => {
            state.loading = true
            state.error = null
        }),
        builder.addCase(registerUser.fulfilled,(state, { payload }) => {
            state.loading = false
            state.success = true 
            state.userInfo = payload.user
            state.userToken = payload.token
        }),
        builder.addCase(registerUser.rejected ,(state, {payload}) => {
            state.loading = false
            state.error = payload
        }),
        builder.addCase(loginUser.fulfilled, (state, {payload}) => {
            state.loading = false
            state.success = true 
            state.userInfo = payload.user
            state.userToken = payload.token
            
        }),
        builder.addCase(loginUser.pending, state => {
                state.loading = true
                state.error = null
        }),
        builder.addCase(loginUser.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        }), 
        builder.addCase(retriveUser.pending, (state) => {
            state.loading = true
            state.error = null
        }),
        builder.addCase(retriveUser.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true 
            state.userInfo = payload.user
        }),
        builder.addCase(retriveUser.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })
    },
    reducers:{}
})

export default authSlice.reducer