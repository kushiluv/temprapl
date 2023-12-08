import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import '../styles/profile.css';
import Collapsible from 'react-collapsible';
import { FiEdit3, FiChevronDown, FiChevronUp, FiSave, FiXCircle } from 'react-icons/fi';

export default function Profile() {
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [details, setDetails] = useState({
        _id: "654fe967c3e37f9977018d9f",
        Username: "Abhinn",
        Email: "abhinn@gmail.com",
        "date of birth": "2023-10-31",
        phone: "12337856",
        address: "New Address",
        Land_Size: "India",
        Village_name: "Alwar",
        imageUrl: "https://via.placeholder.com/150"
    });

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleDetailChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleCancelEdit = () => {
        setEditing(false);
    };

    const saveDetails = (e) => {
        e.preventDefault();
        setEditing(false);
        // Additional logic for saving details can be added here
    };

    return (
        <div className='bruuh'>
            <Navbar />
            <div className="profile-container">
                <div className="profile-header">
                    <img src={details.imageUrl} alt="Profile" className="profile-pic" />
                    <h1>Welcome, {details.Username}!</h1>
                </div>
                {editing ? (
                    <form onSubmit={saveDetails} className="profile-edit">
                        {/* Fields for editing profile */}
                        <label htmlFor="Username">Username:</label>
                        <input type="text" id="Username" name="Username" value={details.Username} onChange={handleDetailChange} />
                        
                        <label htmlFor="Email">Email:</label>
                        <input type="email" id="Email" name="Email" value={details.Email} onChange={handleDetailChange} />
                        
                        <label htmlFor="dob">Date of Birth:</label>
                        <input type="date" id="dob" name="date of birth" value={details["date of birth"]} onChange={handleDetailChange} />
                        
                        <label htmlFor="phone">Phone:</label>
                        <input type="tel" id="phone" name="phone" value={details.phone} onChange={handleDetailChange} />
                        
                        <label htmlFor="address">Address:</label>
                        <input type="text" id="address" name="address" value={details.address} onChange={handleDetailChange} />
                        
                        <label htmlFor="land_size">Land Size:</label>
                        <input type="text" id="land_size" name="Land_Size" value={details.Land_Size} onChange={handleDetailChange} />
                        
                        <label htmlFor="village">Village:</label>
                        <input type="text" id="village" name="Village_name" value={details.Village_name} onChange={handleDetailChange} />
                        
                        <button type="submit" className="save-button">
                            <FiSave size={20} /> Save Changes
                        </button>
                        <button type="button" className="cancel-button" onClick={handleCancelEdit}>
                            <FiXCircle size={20} /> Cancel
                        </button>
                    </form>
                ) : (
                    <div className="profile-details">
                        <h2>Username: <span>{details.Username}</span></h2>
                        <h2>Email: <span>{details.Email}</span></h2>
                        <h2>DOB: <span>{details["date of birth"]}</span></h2>
                        <h2>Phone: <span>{details.phone}</span></h2>
                        <h2>Address: <span>{details.address}</span></h2>
                        <h2>Land Size: <span>{details.Land_Size}</span></h2>
                        <h2>Village: <span>{details.Village_name}</span></h2>
                        <button onClick={handleEditToggle} className="edit-profile-btn">
                            <FiEdit3 />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
