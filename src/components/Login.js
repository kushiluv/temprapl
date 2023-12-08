import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { email, password });

      const data = await response.json();

      if (response.ok) {
        // Handle successful authentication
        console.log(data.message);
        navigate('/'); // Use navigate instead of history.push
      } else {
        // Handle failed authentication
        setLoginError(data.message || 'Login failed');
      }
    } catch (error) {
      setLoginError('');
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      {loginError && <div className="error-message">{loginError}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
