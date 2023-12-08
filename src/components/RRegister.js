import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/Auth.css';

function RRegister() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    pswd: '',
    landSize: '',
    villageName: '',
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add validation logic if needed

    // Display the notification
    alert('Sent an account registration request to the admin');

    // Navigate to the home page
    navigate('/');
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="date" name="dateOfBirth" placeholder="Date of Birth" onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <input type="password" name="pswd" placeholder="Password" onChange={handleChange} />
        <input type="text" name="landSize" placeholder="Land Size" onChange={handleChange} />
        <input type="text" name="villageName" placeholder="Village Name" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RRegister;
