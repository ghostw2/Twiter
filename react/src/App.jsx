import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Home from "./components/Home";
import PostUser from "./components/PostUser";
import GetAllUser from "./components/GetAllUser";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { Provider } from 'react-redux';
import store from './app/store'
import { AuthProvider,useAuth } from "./components/AuthContext"; 
import { useSelector, useDispatch } from "react-redux";
import { retriveUser } from "./feature/auth/AuthSlice";


export default function App() {
  const dispatch = useDispatch()
  const { userToken } = useSelector((state)=>state.auth)
  useEffect(() => {
    if (userToken != null) {
      dispatch(retriveUser({userToken}))
    }
  },[])
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<Home/>} />
          <Route path="post" element={<PostUser />} />
            <Route path="get" element={<GetAllUser />} />
            <Route path="/login" element={<Login  />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </Provider>  
  );
}
//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(<App />);