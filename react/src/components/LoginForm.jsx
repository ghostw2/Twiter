import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector,useDispatch } from "react-redux";
import { loginUser } from "../feature/auth/AuthSlice";

const backend = "http://localhost:3000/";
const LoginForm = () => {
    const [username, setUsername]  = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const {
        loading,userInfo,error,succes,userToken
    } = useSelector(
        (state)=>state.auth
        )
    const submit = (e) => {
        e.preventDefault();
        dispatch(loginUser({username:username,password:password}))
        
    }
    return <div>
        <p className="h2">Login {userToken}</p>
            <form className="form-control" onSubmit={submit}>
                <label className="form-label" >
                    Username
                    <input className="form-control" type="text" onChange={(e)=>setUsername(e.target.value)} value={username}/>
                </label>
                <label className="form-label">
                    Password
                    <input className="form-control" type="password" onChange={(e)=>setPassword(e.target.value)} value={password}/>
                </label>
                <button className="btn btn-primary" role="submit">Submit</button>
            </form>
        </div>
}
// LoginForm.propTypes = {
//     updateToken: PropTypes.func.isRequired,
//     updateUser: PropTypes.func.isRequired,
// }
export default LoginForm;