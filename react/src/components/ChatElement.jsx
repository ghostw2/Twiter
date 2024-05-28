import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = "ws://localhost:3000";

const ChatElement = () => {
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('sdfsfs');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,  // Allow credentials
      transports: ['websocket', 'polling'],  // Use both polling and websocket
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('receiveMessage', (message) => {
      console.log('Message received:', message);
      setMessageList((prevMessageList) => [...prevMessageList, message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const socket = io(SOCKET_SERVER_URL);  // re-initialize socket inside sendMessage
    socket.emit('sendMessage', message);
    setMessageList((prevMessageList) => [...prevMessageList, message]);
    setMessage("");
  };

  return (
    <div>
      <p className='h2'>This is the chat!</p>
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
              <li className="list-group-item"><a href='#'>Cras justo odio</a></li>
              <li className="list-group-item"><a href='#'>Dapibus ac facilisis in</a></li>
              <li className="list-group-item"><a href='#'>Morbi leo risus</a></li>
              <li className="list-group-item"><a href='#'>Porta ac consectetur ac</a></li>
              <li className="list-group-item"><a href='#'>Vestibulum at eros</a></li>
            </ul>
          </div>
          <div className='col-md-8 col-12 bg-white'>
            <div className='row p-2 rounded-3'>
              {messageList.map((msg, index) => (
                <div key={index} className='col-12'>
                  <div className='row'>
                    <div className={`col-6 ${msg.sentByUser ? 'text-right' : ''} rounded-pill p-2 px-3`} style={{ backgroundColor: msg.sentByUser ? 'green' : 'red' }}>
                      <span>{msg}</span>
                    </div>
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
