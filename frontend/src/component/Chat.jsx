import React, { useState, useEffect, useMemo ,useRef} from 'react';
import { io } from 'socket.io-client';
import axios from "axios";
import { useParams } from 'react-router-dom';
import  './chat.css';

const Chat = () => {
  const chatWindowRef = useRef(null);

  const { sender_id, chat_id,name } = useParams();
  const socket = useMemo(() => io('http://localhost:3000', {
    transports: ['websocket'],
    reconnection: true,
  }), []);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected,setSocketConnected] = useState(true)


  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);


  useEffect(() => {
    socket.on('connect', () => {
      setSocketConnected(true);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    socket.on('disconnect', (reason) => {
      setSocketConnected(false);
      ('Disconnected:', reason);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, [socket]);

  useEffect(() => {
    if (!socketConnected) return;

    const loadMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getmessages/${sender_id}/${chat_id}`
        );
        if (response.data.success) {
          setMessages(response.data.data);
          
          
        

        }
       
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    

    loadMessages();

    const roomId = [ chat_id].sort().join('_');
    socket.emit('join_chat', roomId);
    (`Joined room: ${roomId}`);

    // Listen for incoming messages
    socket.on('recevermesssge', (message) => {
      ('New message received:', message);
      setNewMessage('')
      setMessages((prevMessages) => [...prevMessages, { content: message }]);
      loadMessages()
    });

    return () => {
      socket.off('recevermesssge'); // Clean up listener
    };
  }, [sender_id, chat_id],messages);

  const handleSendMessage = async (e) => {
     e.preventDefault()
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: sender_id,
      chat_id: chat_id,
      content: newMessage,
      createdAt: new Date(),
    };

    try {
      const url ='http://localhost:3000';
      const response = await axios.post(
        url+'/inputmessege',
        messageData
      );
(response.data.succes,'rrespose.data.succes');

      if (response.data.succes) {
        // setMessages((prev) => [...prev, messageData]);
        // setNewMessage('');
        

        socket.emit('sendMessage', messageData);
        ('Message sent:', messageData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  return (
    <div className="chat-container">
      <nav className="navbar">
        <h1>{name}</h1>
      </nav>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          
          <div
            key={index}
            className={msg.senderId === sender_id ? 'my-message' : 'their-message'}
          >
            <p>
           <div style={{fontSize:'12px',color:'green'}}><strong>{msg.senderName}</strong> </div> 
            <span>{msg.content}</span>
              </p>
          </div>
                    
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;