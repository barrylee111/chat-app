// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import RegistrationForm from './RegistrationForm';
import Login from './Login';
import Messages from './Messages'; // Assuming you have a Messages component
import { User } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('isLoggedIn');
    if (token === 'true') {
      setIsLoggedIn(true);
    }
    fetchUsers();
    setupWebSocket();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };
  
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data); // Assuming data contains an array of User objects
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const setupWebSocket = () => {
    const ws = new WebSocket('ws://localhost:3000'); // Connect to WebSocket server
    setWs(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      // Handle incoming messages and update state accordingly
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };
  };

  return (
    <Router>
      <div className="App">
        <h1>Chat App</h1>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <Routes>
              <Route path="/messages" element={<Messages />} />
              <Route path="*" element={<Navigate to="/messages" />} /> {/* Redirect to /messages if no matching route */}
            </Routes>
          </>
        ) : (
          <>
            <div><h3>Registration</h3></div>
            <RegistrationForm setUsers={setUsers} />
            <div><h3>Login</h3></div>
            <Login onLogin={() => setIsLoggedIn(true)} />
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
