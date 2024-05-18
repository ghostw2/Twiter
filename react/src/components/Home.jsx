import React from "react";

const Home = (props) => {
  const { user } = props;
  return <div>
    <h1>Welcome, Home</h1>
    <h2>{user.username}</h2>
    </div>

    ;
  };
  
  export default Home;
