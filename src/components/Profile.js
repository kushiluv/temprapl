import React, { useState, useEffect } from 'react';
import { FiEdit2, FiSave, FiXCircle } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Navbar from './Navbar';
import '../styles/profile.css';
import Collapsible from 'react-collapsible';
import { FiEdit3, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [details, setDetails] = useState({});
  const [file, setFile] = useState(null); // State for the profile picture file
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [listedProducts, setListedProducts] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/session');
        if (!response.ok) throw new Error('Failed to fetch user session');
        const data = await response.json();
        if (data.is_authenticated) {
          setUser(data);
          // Once the user is confirmed, fetch their details
          const detailsRes = await fetch(`api/Farmer/${data.user_id}`);
          if (!detailsRes.ok) throw new Error('Failed to fetch user details');
          const detailsData = await detailsRes.json();
          setDetails({
            ...detailsData,
            imageUrl: detailsData.picture_id ? `/image/${detailsData.picture_id}` : 'https://via.placeholder.com/150'
          });
        }
      } catch (err) {
        setError(err.message);
      }
    };
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/user/orders'); // Adjust endpoint as needed
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    // Fetch listed products
    const fetchListedProducts = async () => {
      try {
        const response = await axios.get('/api/user/listed-products'); // Adjust endpoint as needed
        setListedProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching listed products:", error);
      }
    };

    fetchOrders();
    fetchListedProducts();
    fetchUser();
  }, []);
  const toggleSection = (section) => {
    if (section === 'profile') setIsProfileOpen(!isProfileOpen);
    if (section === 'orders') setIsOrdersOpen(!isOrdersOpen);
    if (section === 'products') setIsProductsOpen(!isProductsOpen);
  };
const [isOrderDetailOpen, setIsOrderDetailOpen] = useState({});
const [isProductDetailOpen, setIsProductDetailOpen] = useState({});

const toggleOrderDetails = (orderId) => {
    setIsOrderDetailOpen(prevState => ({
        ...prevState,
        [orderId]: !prevState[orderId]
    }));
};

const toggleProductDetails = (productId) => {
    setIsProductDetailOpen(prevState => ({
        ...prevState,
        [productId]: !prevState[productId]
    }));
};
const handleCancelEdit = () => {
  setEditing(false);
};
  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleDetailChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const saveDetails = async (e) => {
    e.preventDefault(); // Prevent form from causing a page reload

    const formData = new FormData();
    // Append file to formData if there's a file selected
    if (file) {
      formData.append('picture', file);
    }
    // Append details to formData
    for (const key in details) {
      if (key !== 'imageUrl') { // Do not send imageUrl as part of the form data
        formData.append(key, details[key]);
      }
    }

    try {
      const response = await axios.put(`/Farmer/${user.user_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setEditing(false);
        // Handle additional logic if needed
      } else {
        throw new Error('Failed to update user details');
      }
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (error) return <div className="profile-error">{error}</div>;
  if (!user) return <div className="profile-loading">Loading profile...</div>;
  if (!user.is_authenticated) return <div className="profile-error">Please log in.</div>;

  return (
    <div className='bruuh'>
    <Navbar />
    
    <div className="profile-container">
      <div className="profile-header">
        
      <img src={details.imageUrl} alt="Profile" className="profile-pic" />
      <h1>Welcome, {details.Username || user.username}!</h1>
      
    </div>
      {editing ? (
        <form onSubmit={saveDetails} className="profile-edit">
          {/* Username field */}
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="Username"
            value={details.Username || ''}
            onChange={handleDetailChange}
          />
          {/* Email field */}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="Email"
            value={details.Email || ''}
            onChange={handleDetailChange}
          />
          {/* DOB field */}
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="date of birth"
            value={details['date of birth']
 || ''}
            onChange={handleDetailChange}
          />
          {/* Phone field */}
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={details.phone || ''}
            onChange={handleDetailChange}
          />
          {/* Address field */}
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={details.address || ''}
            onChange={handleDetailChange}
          />
          {/* Land Size field */}
          <label htmlFor="land_size">Land Size:</label>
          <input
            type="text"
            id="land_size"
            name="Land_Size"
            value={details['Land_Size']
 || ''}
            onChange={handleDetailChange}
          />
          {/* Village field */}
          <label htmlFor="village">Village:</label>
          <input
            type="text"
            id="village"
            name="Village_name"
            value={details['Village_name'] || ''}
            onChange={handleDetailChange}
          />
          {/* File input for picture upload */}
          <label htmlFor="picture">Profile Picture:</label>
          <input
            type="file"
            id="picture"
            name="picture"
            onChange={handleFileChange}
          />
          {/* Submit button */}
          <button type="submit" className="save-button">
          <FiSave size={20} /> Save Changes
        </button>
        <button type="button" className="cancel-button" onClick={handleCancelEdit}>
                  <FiXCircle size={20} /> Cancel
        </button>
        </form>
      ) : (
        <div className={`collapsible-section ${isProfileOpen ? 'open' : ''}`}>
          <div className="trigger" onClick={() => toggleSection('profile')}>
            Profile Details {isProfileOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {isProfileOpen && (
            <div className="content">
              <h2>Username: <span>{details.Username}</span></h2>
            <h2>Email: <span>{details.Email}</span></h2>
            <h2>DOB: <span>{details['date of birth']}</span></h2>
            <h2>Phone: <span>{details.phone}</span></h2>
            <h2>Address: <span>{details.address}</span></h2>
            <h2>Land Size: <span>{details['Land_Size']}</span></h2>
            <h2>Village: <span>{details['Village_name']}</span></h2>
              <button onClick={handleEditToggle} className="edit-profile-btn">
                {editing ? 'Cancel' : <FiEdit3 />}
              </button>
            </div>
          )}
        </div>
        
      )}
    
     {/* Order History Section */}
     <div className="collapsible-section">
                <div className="trigger" onClick={() => toggleSection('orders')}>
                    Order History
                    {isOrdersOpen ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {isOrdersOpen && (
                    <div className="content">
                        {orders.map(order => (
                            <div key={order._id}>
                                <div className="trigger" onClick={() => toggleOrderDetails(order._id)}>
                                    Order ID: {order._id}
                                    {isOrderDetailOpen[order._id] ? <FiChevronUp /> : <FiChevronDown />}
                                </div>
                                {isOrderDetailOpen[order._id] && (
                                    <div className="order-details">
                                        {/* Display each product within an order */}
                                        {order.products.map(product => (
                                            <div className="product-details" key={product._id}>
                                                <img src={product.coverImg} alt={product.product_name} />
                                                <p>Name: {product.product_name}</p>
                                                <p>Price: Rs. {product.product_price}</p>
                                                <p>Quantity: {product.quantity}</p>
                                            </div>
                                        ))}
                                        <p>Total Price: Rs. {order.total_price}</p>
                                        <p>Status: {order.status}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Products Listed Section */}
            <div className="collapsible-section">
                <div className="trigger" onClick={() => toggleSection('products')}>
                    Products Listed
                    {isProductsOpen ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {isProductsOpen && (
                    <div className="content">
                        {listedProducts.map(product => (
                            <div key={product._id}>
                                <div className="trigger" onClick={() => toggleProductDetails(product._id)}>
                                    {product.title}
                                    {isProductDetailOpen[product._id] ? <FiChevronUp /> : <FiChevronDown />}
                                </div>
                                {isProductDetailOpen[product._id] && (
                                    <div className="product-details">
                                        <img src={product.coverImg} alt={product.product_name} />
                                        <p>Description: {product.description}</p>
                                        <p>Price: Rs. {product.price}</p>
                                        <p>Stock: {product.stock}</p>
                                        <p>Is Approved: {product.isApproved ? 'Yes' : 'No'}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
);
}