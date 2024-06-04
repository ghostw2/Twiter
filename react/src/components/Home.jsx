import React from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
const Home = () => {
  const { username,id,token } = useAuth();
  const greeting = (username != '') ?
    `Hello there,${username} your user id is :${id} and the token is ${token}`
    :
    <div className="container">
      <div>
        <Link className="nav-link btn btn-primary btn-lg" to="/login">Login</Link>
      </div>
    </div>;
  return <div>
    <h1>Welcome, Home</h1>
      {greeting}
    </div>
    ;
  };
  
  export default Home;
