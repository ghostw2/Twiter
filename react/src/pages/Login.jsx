import React from "react";
import { useState } from "react";
import PropTypes from 'prop-types';
import LoginForm from "../components/LoginForm";
import { useAuth } from "../components/AuthContext";

const Login = (props) => {
    const {updateAuth} = useAuth()
    return <div className="container">
        <LoginForm updateAuth={updateAuth}  />
    </div>
}
// Login.propTypes = {
//     updateToken: PropTypes.func.isRequired,
//     updateUser: PropTypes.func.isRequired,
// }
export default Login;


