import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoginError('');

    // Hardcoded credentials check
    if (email === 'abhinn@gmail.com' && password === 'pass') {
      console.log("Logged in successfully");
      const userData = { username: "abhinn" };
      localStorage.setItem("user", JSON.stringify(userData)); // Save user data to local storage
      navigate('/'); // Navigate to the home page on successful login
  } else {
      setLoginError('Invalid email or password.');
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
