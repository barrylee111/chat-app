import React, { useState } from 'react';
import { User } from './types';


interface RegistrationFormProps {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [registrationError, setRegistrationError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Send registration request to backend
      const response = await fetch('http://localhost:8080/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to register');
      }
      // Clear form fields after successful registration
      setFormData({ username: '', email: '', password: '' });
      setRegistrationError('');
      // Provide feedback to the user indicating successful registration
      alert('Registration successful! Please login.');
    } catch (error:any) {
      console.log('Registration failed:', error);
      // Handle registration error
      setRegistrationError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      <button type="submit">Register</button>
      {registrationError && <div>{registrationError}</div>}
    </form>
  );
};

export default RegistrationForm;
