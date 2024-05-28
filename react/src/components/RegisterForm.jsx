import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {updateAuth} = useAuth();
    const submit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/register",
            {
                email: email,
                username: username,
                password:password
            }
        ).then(response => {
            if (response.data.success === true) {
                
                updateAuth(response.data.token,
                    response.data.user.username,
                    response.data.user.id)
                console.log(response.data.user.username);
                navigate('/');
                
            }
        }).catch (error => {
            console.log(error.message);  
        })
    }
    return <div>
        <p className="h2">Register</p>
            <form className="form-control" onSubmit={submit}>
                <label className="form-label">
                    E-mail
                    <input className="form-control" type="text" onChange={(e)=>setEmail(e.target.value)} value={email}/>
                </label>
                <label className="form-label">
                    Username
                    <input className="form-control" type="text" onChange={(e)=>setUsername(e.target.value)} value={username}/>
                </label>
                <label className="form-label">
                    Password
                    <input className="form-control" type="password" onChange={(e)=>setPassword(e.target.value)} value={password}/>
                </label>
                <button className="btn btn-primary">Submit</button>
            </form>
    </div>
}
export default RegisterForm;