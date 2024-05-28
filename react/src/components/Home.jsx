import React from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
const Home = () => {
  const { username } = useAuth();
  const greeting = (username != '') ? `Hello there,${username}` : <Link className="nav-link btn btn-primary btn-lg" to="/login">Login</Link>;
  return <div>
    <h1>Welcome, Home</h1>
      {greeting}
    </div>
    ;
  };
  
  export default Home;
