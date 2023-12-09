import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sell.css'; // Create and import appropriate styles
import axios from 'axios';

function Sell() {
    
    
    const [form, setForm] = useState({
      title: '',
      description: '',
      price: '',
      stock: ''
    });
    const [file, setFile] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(true); // State to manage authorization
    const navigate = useNavigate();
  
    useEffect(() => {
      // Perform session check on component mount
      const checkSession = async () => {
        try {
          const response = await axios.get('/session');
          if (response.status === 200) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            navigate('/login'); // Redirect to login if not authorized
          }
        } catch (error) {
          setIsAuthorized(false);
          navigate('/login'); // Redirect to login if session check fails
        }
      };
  
      checkSession();
    }, [navigate]);
  

  const handleChange = (e) => {
    if (e.target.name === 'coverImg') {
      setFile(e.target.files[0]);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    if (file) {
      formData.append('coverImg', file);
    }
    
    try {
      const response = await axios.post('/api/sell', formData, {
        withCredentials: true, // Important if you're using sessions
      });
      console.log(response.data);
      navigate('/market');
    } catch (error) {
      console.error('Error listing product!', error);
    }
};

  return (
    <div className="sell-container">
      <h1>List a New Item</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Title" onChange={handleChange} />
        <textarea name="description" placeholder="Description" onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} />
        <input type="number" name="stock" placeholder="Stock" onChange={handleChange} />
        <input type="file" name="coverImg" onChange={handleChange} />
        <button type="submit">List Item</button>
      </form>
    </div>
  );
}

export default Sell;
