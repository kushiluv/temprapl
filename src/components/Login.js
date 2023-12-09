import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
    
      const data = await response.json();
    
      if (response.ok) {
        console.log(data.message);
        navigate('/');
      } else {
        console.log("Response not OK", data);
        setLoginError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error("Fetch error", error);
      setLoginError('Failed to connect to the server.');
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
