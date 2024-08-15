import React from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const Home = () => {
  const { userInfo,userToken } = useSelector((state)=>state.auth);
  const greeting =
    `Hello there, your user Name  is :${userInfo.username} and the userId is ${userInfo.id}`;
    
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
