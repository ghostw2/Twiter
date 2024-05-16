import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from "./components/Layout";
import Home from "./components/Home";
import PostUser from "./components/PostUser";
import GetAllUser from "./components/GetAllUser";
import Login from "./pages/login";

export default function App() {
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post" element={<PostUser />} />
            <Route path="get" element={<GetAllUser />} />
            <Route path="/login" element={<Login/>} />
          </Route>
        </Routes>
        </BrowserRouter>
    
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);