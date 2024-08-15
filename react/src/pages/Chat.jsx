import react, { useEffect } from "react"
import ChatElement from "../components/ChatElement";
import { useAuth } from "../components/AuthContext";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Chat = () => {
    const { userInfo, userToken } = useSelector((state)=>state.auth);
  
    return userToken ? <div>
                            <h2>{userInfo.username} here you can chat will all you friends</h2>
                            <ChatElement id={userInfo} token={userToken}/>
                        </div>:<Navigate to='/login'/>
}
export default Chat;