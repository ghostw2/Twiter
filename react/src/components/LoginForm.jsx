import React from "react";
import { useState } from "react";
import axios from "axios";

const LoginForm = () => {
    const [username, setUsername]  = useState('');
    const [password, setPassword]  = useState('');
    const submit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/login",
            {
                username: username,
                password:password
            }
        ).then(response => {
            console.log(response);
        }).catch (error => {
            console.log(error);  
         })
    }
    return <div>
        <p className="h2">Login</p>
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
export default LoginForm;