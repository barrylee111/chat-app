// Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('isLoggedIn', 'true');
        
        onLogin();
        navigate('/messages');
      } else {
        // Handle login error
        setLoginError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error
      setLoginError('An error occurred during login.');
    }
  };  

  return (
    <form onSubmit={handleLogin}>
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      <button type="submit">Login</button>
      {loginError && <div>{loginError}</div>}
    </form>
  );
};

export default Login;
