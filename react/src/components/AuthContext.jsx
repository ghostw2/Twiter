import React, { createContext, useState, useContext, Children } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [token, setToken] = useState(localStorage.getItem('token') || "");
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [id,setId] = useState(localStorage.getItem('id') || '')
    const updateAuth = (newToken,newUsername,newId) => {
      setToken(newToken);
      setUsername(newUsername)
      setId(newId)  
        if (newToken) {
          localStorage.setItem('token', newToken);
          localStorage.setItem('username', newUsername);
          localStorage.setItem('id',newId)
          } else {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('id')
          }

    }
    return (<AuthContext.Provider value={{ token,username,id, updateAuth }}>
        {children}
    </AuthContext.Provider>);
}
export const useAuth = () => useContext(AuthContext);