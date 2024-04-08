import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User } from './types';

interface Message {
  id: number;
  sender: string;
  message: string;
}

const Messages: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(() => {
    const storedSelectedUser = localStorage.getItem('selectedUser');
    return storedSelectedUser ? JSON.parse(storedSelectedUser) : null;
  });
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const token = localStorage.getItem('token');
  const decodedToken: any = jwtDecode(token || '');


  const fetchMessages = useCallback(async (selectedUserId: string) => {
    try {
      console.log('Fetching messages for user:', selectedUserId);
      const response = await fetch(`http://localhost:8080/messages/?${selectedUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentUserId: decodedToken.userId,
          selectedUserId
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
      console.log('Messages fetched');
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [decodedToken]);
  
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser, fetchMessages]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        const filteredData = data.filter((user: User) => user._id !== decodedToken.userId);
        setUsers(filteredData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!ws) {
      const setupWebSocket = () => {
        const newWs = new WebSocket('ws://localhost:8080'); // Adjust WebSocket URL as needed
    
        newWs.onopen = () => {
          console.log('WebSocket connected');
        };
    
        newWs.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (
            (message.sender === selectedUser?._id && message.receiver === decodedToken.userId) ||
            (message.sender === decodedToken.userId && message.receiver === selectedUser?._id)
          ) {
            setMessages(prevMessages => [...prevMessages, message]);
          }
        };
    
        newWs.onclose = () => {
          console.log('WebSocket closed');
          setWs(null);
        };
    
        setWs(newWs);
      };

      setupWebSocket();
    }
  }, [decodedToken, selectedUser, ws]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    console.log('Selected user:', userId);
    const selected = users.find(user => user._id === userId);
    if (selected) {
      console.log('Setting selected user:', selected);
      setSelectedUser(selected);
      console.log(selected._id);
      localStorage.setItem('selectedUser', JSON.stringify(selected));
      fetchMessages(selected._id);
    }
  };

  const sendMessage = async () => {
    try {
      if (!selectedUser) {
        throw new Error('No user selected');
      }
      const response = await fetch('http://localhost:8080/messages/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver: selectedUser._id,
          message,
          sender: decodedToken.userId
        })
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      setMessage('');
      fetchMessages(selectedUser._id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h2>Messages</h2>
      <div>
        <select value={selectedUser?._id || ''} onChange={handleUserChange}>
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.username}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Message:</label>
        <textarea value={message} onChange={handleMessageChange}></textarea>
      </div>
      <button onClick={sendMessage}>Send Message</button>
      <div>
        <h3>Conversation</h3>
        {messages.map((message) => (
          <div key={message.id}>
            <p>{message.sender === selectedUser?._id ? selectedUser?.username : 'Me'}: {message.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
