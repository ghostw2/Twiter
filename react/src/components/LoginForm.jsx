import React from "react";
import { useState } from "react";


const LoginForm = () => {
    const [username, setUsername]  = useState();
    const [password, setPassword]  = useState();

    return<div>
            <form>
                <label>
                    Username
                    <input type="text" onChange={(e)=>setUsername(e.target.value)} value={username}/>
                </label>
                <label>
                    Password
                    <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password}/>
                </label>
                <button>Submit</button>
            </form>
        </div>
}
export default LoginForm;