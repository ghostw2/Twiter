import React, { createContext, useState, useContext, Children } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [token, setToken] = useState(localStorage.getItem('token') || "");
    const [username, setUsername] = useState(localStorage.getItem('username') || '');

    const updateAuth = (newToken,newUsername) => {
        setToken(newToken);
        setUsername(newUsername)
        if (newToken) {
            localStorage.setItem('token', newToken);
            localStorage.setItem('username', newUsername);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
          }

    }
    return (<AuthContext.Provider value={{ token,username, updateAuth }}>
        {children}
    </AuthContext.Provider>);
}
export const useAuth = () => useContext(AuthContext);