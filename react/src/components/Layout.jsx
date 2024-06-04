import { Button } from "bootstrap";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
const Layout = () => {
  const { updateAuth } = useAuth();
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Navbar</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse px-3 justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
            <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/register">Register</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/chat">Chat</Link>
            </li>
          </ul>
          <button className="btn btn-danger" onClick={()=>{updateAuth(null,null,null)}}>Log Out</button>
        </div>
      </nav>
      <Outlet />
    </>
  )
};
export default Layout;
