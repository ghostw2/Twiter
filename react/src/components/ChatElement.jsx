import React, { useState, useEffect,useRef } from 'react';
import io from 'socket.io-client';
import useAxios from '../helpers/axiosConfig';

const SOCKET_SERVER_URL = "http://localhost:3000";

const ChatElement = ({id,token}) => {

  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('sdfsfs');
  const [messageList, setMessageList] = useState([]);
  const [chatList, setChatList] = useState([]) 
  const [currentChat, setCurrentChat] = useState('')
  
  const socketRef = useRef();
  const axiosInstance = useAxios();
  const changeChat = (chat_id)=>{
    setCurrentChat(chatList.find((chat) => chat._id === chat_id));
    console.log(currentChat);
  }
  useEffect(() => {

      axiosInstance.get('/chat').then((response) => {
        console.log(response)
        if (response.status === 200) {
          setChatList(response.data.chats);
        }
        
      }).catch((e) => {
        alert(e.message);
      });
    
    
    
    socketRef.current = io(SOCKET_SERVER_URL, {
      withCredentials: true,  // Allow credentials
      auth: {
        token
      },
      transports: ['websocket', 'polling'],  // Use both polling and websocket
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('loadChats')
    });

    socketRef.current.on('receiveMessage', (message) => {
    
      setMessageList((prevMessageList) => [...prevMessageList, message]);
    });

    socketRef.current.on('chatsLoaded', (data) => { 
      console.log("these are the chatList",data);
      setChatList(data);
    });
    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  const sendMessage = () => {
   // const socket = io(SOCKET_SERVER_URL);  // re-initialize socket inside sendMessage
   socketRef.current.emit('sendMessage', { text: message, chat_id: currentChat, sender: id });
    setMessage('')
  };

  return (
    <div>
      <div className='container bg-light p-3'>
        <div className='row'>
          <div className='col-md-4 col-12'>
            <div className='w-75 mx-auto'>
              <input
                type="text"
                className='form-control'
                placeholder='Search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <ul className="list-group mt-4">

              {chatList.map((chat, index) => (
               <li role='button' key={index}  className="list-group-item " >
                  <a onClick={(e) => { e.preventDefault; setCurrentChat(chat); }} >this is chat #{chat._id}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className='col-md-8 col-12 bg-white'>
            <div className='row p-2 rounded-3'>
              {messageList.map((msg, index) => (
                <div key={index} className='col-12'>
                  <div className='row'>
                    {
                      msg.sender === id && (
                        <div className='col-6 offset-6 rounded-pill p-2 px-3' style={{backgroundColor:'green'}}>
                          <span>{msg.text}</span>
                        </div>
                      ) 
                    }
                    {
                      msg.sender !== id && (
                        <div className={`col-6 rounded-pill p-2 px-3`} style={{ backgroundColor: 'red' }}>
                          <span>{msg.text}</span>
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
