import react from "react"
import ChatElement from "../components/ChatElement";
import { useAuth } from "../components/AuthContext";
import { Navigate } from "react-router-dom";
const Chat = () => {
    const { username, id, token } = useAuth();
    
  console.log("Username:", username);
  console.log("ID:", id);
  console.log("Token:", token);
    return token ? <div>
        <h2>{username} here you can chat will all you friends</h2>
        <ChatElement id={id} token={token}/>
    </div>:<Navigate to='/login'/>
}
export default Chat;