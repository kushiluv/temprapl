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
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === 'picture') {
      setFile(e.target.files[0]);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    if (file) {
      formData.append('picture', file);
    }

    try {
      const response = await fetch('/https://ritflaskapp.azurewebsites.net/register', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      // console.log(responseData);
      navigate('/');
    } catch (error) {
      console.error('Error submitting form!', error);
    }
  };


  return (
    <div className="auth-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} /> {/* Email input field */}
        <input type="date" name="dateOfBirth" placeholder="Date of Birth" onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <input type="password" name="pswd" placeholder="Password" onChange={handleChange} />
        <input type="text" name="landSize" placeholder="Land Size" onChange={handleChange} />
        <input type="text" name="villageName" placeholder="Village Name" onChange={handleChange} />
        <input type="file" name="picture" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RRegister;