import React, { useState, useEffect,useRef } from 'react';
import io from 'socket.io-client';
import useAxios from '../helpers/axiosConfig';
import NewChatModal from './NewChat';
import useWebSocket, { ReadyState } from 'react-use-websocket'

const SOCKET_SERVER_URL = "ws://localhost:3000";

const ChatElement = ({userInfo,token}) => {
  
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('enter you text here');
  const [messageList, setMessageList] = useState([]);
  const [chatList, setChatList] = useState([]); 
  const [currentChat, setCurrentChat] = useState('');
 
  //const socketRef = useRef();
  const axiosInstance = useAxios();
  const connection = useRef(null);
  
  useEffect(() => {
    
    axiosInstance.get('/chat', {
        params: { user_id: userInfo.id }
      }
    ).then((response) => {
      if (response.status === 200) {
        setChatList(response.data.chats);
      }
      
    }).catch((e) => {
      alert(e.message);
    });
  }, [userInfo.id]);
  useEffect(() => {
    if (currentChat === '') return;
    console.log(currentChat)
    axiosInstance.get('/chat/messages',
      {
        params: { id: currentChat }
      }).then((response) => {
      if (response.status === 200) {
        setMessageList(response.data.messages);
        console.log(response.data.messages)
      }
    }).catch((e) => {
      alert(e.message);
    });
  }, [currentChat])
  useEffect(() => {
    const socket = new WebSocket(SOCKET_SERVER_URL+`?token=${token}`);
    socket.addEventListener('open', (event) => {
      console.log('websocker opened');
    })
    socket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data)
      setMessageList((prevMessageList) => [...prevMessageList, msg]);
      console.log('message form server:'+event.data)
    })
    socket.addEventListener('userConnected', (event) => {
      console.log("New user connected"+event.data);
    })
    socket.addEventListener('UserDisconnected', (event) => {
      console.log('User disconnected'+event.data)
    })
    connection.current = socket
    return () => connection.current.close()
  },[])

  //useEffect(() => {
    // console.log('Connection state changed')
    // if (readyState === ReadyState.OPEN) { 
    //   sendJsonMessage({
    //     event: "subscripe",
    //     data:{channel:"this is the channel"}
    //   })
    // }

  //  const socketRef = useWebSocket(SOCKET_SERVER_URL, {
  //     onOpen: ()=>{
  //       console.log("WebSocket connection established.")
  //     },
  //     onMessage: (event) => {
  //       console.log(event)
  //     },
  //     onClose: () => {
  //       console.log('disconected ws')
  //     }
  //   })
  //   socketRef.close();
    
    
    // io(SOCKET_SERVER_URL, {
    //   withCredentials: true,  // Allow credentials
    //   auth: {
    //     token
    //   },
    //   transports: ['websocket', 'polling'],  // Use both polling and websocket
    // });

    // socketRef.current.on('connect', () => {
    //   socketRef.current.emit('loadChats')
    // });

    // socketRef.current.on('receiveMessage', (message) => {
    //   setMessageList((prevMessageList) => [...prevMessageList, message]);
    // });

    // socketRef.current.on('chatsLoaded', (data) => { 
    //   console.log("these are the chatList",data);
    //   setChatList(data);
    // });
    // // Cleanup on component unmount
    // return () => {
    //   socketRef.current.disconnect();
    // };
  // }, [readyState]);

  const sendMessage = () => {
    setMessage(message.trim())
    if(connection.current && connection.current.ReadyState === WebSocket.ReadyState){
      if (message !== "") { 
        connection.current.send(JSON.stringify(
          { message: { text: message, chat_id: currentChat, sender: userInfo.id }, token: token }
        ));
      }
    }
    setMessage("")
   
   // const socket = io(SOCKET_SERVER_URL);  // re-initialize socket inside sendMessage
  //  socketRef.current.emit('sendMessage', { text: message, chat_id: currentChat, sender: id });
  //   setMessage('')
  };
  function timeSince(date) { 
    const now = new Date();
    const convertedDate = new Date(date);
    const seconds = Math.floor((now - convertedDate) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago `;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago `;
    interval = Math.floor(seconds / 86400); // Days
    if (interval > 1) return `${interval} days ago`;

    interval = Math.floor(seconds / 3600); // Hours
    if (interval > 1) return `${interval} hours ago`;

    interval = Math.floor(seconds / 60); // Minutes
    if (interval > 1) return `${interval} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
  }

  return (
    <div>
      
      <div className='container bg-light p-3'>
        <div className='row'>
          <div className='col-md-3 col-6'>
            <div className='w-75 mx-auto'>
              <input
                type="text"
                className='form-control'
                placeholder='Search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
             <NewChatModal id={userInfo.id}></NewChatModal>
            </div>
            <ul className="list-group mt-4">

              {chatList.map((chat, index) => (
                <li key={index} className="list-group-item p-0 d-flex" >
                  {
                    chat._id === currentChat &&
                    <a className='bg-primary p-2 text-light text-decoration-none w-100' onClick={(e) => { e.preventDefault(); setCurrentChat(chat._id); }} >
                      {chat.recivers.map(reciver => reciver.username).join(",")}
                    </a> 
                  }
                  { 
                    chat._id !== currentChat &&
                    <a className='p-2 text-decoration-none' onClick={(e) => { e.preventDefault(); setCurrentChat(chat._id); }} >
                        {chat.recivers.map(reciver => reciver.username).join(",")}
                    </a>
                
                  }
                </li>
              ))}
            </ul>
          </div>
          <div className='col-md-6 col-6 bg-white'>
            <div className='row p-2 rounded-3'>
              {messageList.map((msg, index) => (
                <div key={index} className='col-12'>
                  <div className='row'>
                    {
                      msg.sender._id === userInfo.id && (
                        <div className='col-6 offset-6 rounded-pill p-2 px-3 mb-1' style={{backgroundColor:'green'}}>
                          <p className='p-0 m-0'>{msg.message}
                            <br></br>
                            <span className='text-light small font-italic'>You</span>
                            &nbsp;&nbsp;&nbsp;
                            <span className='text-light '>{ timeSince(msg.createdAt)}</span>
                          </p>
                        </div>
                      ) 
                    }
                    {
                      msg.sender._id !== userInfo.id && (
                        <div className={`col-6 rounded-pill p-2 px-3 mb-1`} style={{ backgroundColor: 'red' }}>
                          <p className='p-0 m-0'>{msg.message}
                            <br></br>
                            <span className='text-light small font-italic'>by {msg.sender.username}</span>
                            &nbsp;&nbsp;&nbsp;
                            <span className='text-light '>{ timeSince(msg.createdAt)}</span>
                          </p>
                        </div>
                      )
                    }
                    
                    <div className='col-6'></div>
                  </div>
                </div>
              ))}
              <div className='col-12'>
                <input
                  type="text"
                  className='form-control'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ChatElement;
