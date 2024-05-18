import React from "react";
import { useState } from "react";
import PropTypes from 'prop-types';
import LoginForm from "../components/LoginForm";

const Login = (props) => {
    return <div className="container">
        <LoginForm updateUser={props.updateUser} updateToken={props.updateToken} />
    </div>
}
Login.propTypes = {
    updateToken: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
}
export default Login;


