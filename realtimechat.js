import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000'); // Replace with your server URL
    setSocket(newSocket);

    // Cleanup connection on component unmount
    return () => {
      newSocket.off('message');
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Cleanup the listener on unmount
      return () => {
        socket.off('message');
      };
    }
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage && socket) {
      socket.emit('sendMessage', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
