import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ApprovalPage.css';

function ApprovalPage() {
  const [unapprovedProducts, setUnapprovedProducts] = useState([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
        try {
            const sessionResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/unapproved`);
            if (sessionResponse.data.is_authenticated) {
                setIsAuthenticated(true);
                fetchUnapprovedUsers();
                fetchUnapprovedProducts();
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            setIsAuthenticated(false);
        }
    };
    // Fetch unapproved products
    const fetchUnapprovedUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/unapproved`);
            setUnapprovedUsers(response.data);
        } catch (error) {
            console.error('Error fetching unapproved users', error);
        }
    };
    const fetchUnapprovedProducts = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/unapproved`);
          console.log("Response data:", response.data); // Log the response data
          setUnapprovedProducts(response.data);
        } catch (error) {
          console.error('Error fetching unapproved products', error);
          console.log("Error response:", error.response); // Log the error response
        }
      };
    checkAuthentication();
    fetchUnapprovedProducts();
    fetchUnapprovedUsers();
    
  }, []);
 
  const handleApproveUser = async (userId) => {
    try {
        await axios.post(`/approve_user/${userId}`);
        setUnapprovedUsers(unapprovedUsers.filter(user => user._id !== userId));
    } catch (error) {
        console.error('Error approving user', error);
    }
};
  const handleApprove = async (productId) => {
    try {
      await axios.post(`/products/approve/${productId}`);
      // Filter out the approved product from the state
      setUnapprovedProducts(unapprovedProducts.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error approving product', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/products/${productId}`);
      // Filter out the deleted product from the state
      setUnapprovedProducts(unapprovedProducts.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };
  if (!isAuthenticated) {
    return (
        <div>
            <p>You are not authorized to view this page. Please log in.</p>
            {/* Optionally redirect to login page */}
            {/* {navigate('/login')} */}
        </div>
    );
}
  return (
    <div className="approval-container">
        <h1>Approve Users</h1>
        {unapprovedUsers.length > 0 ? (
            unapprovedUsers.map(user => (
                <div key={user._id} className="user-info">
                    <img src={user.picture_id} alt={user.Username} />
                    <div className="user-details">
                        <span><strong>Username:</strong> {user.Username}</span>
                        <span><strong>Email:</strong> {user.Email}</span>
                        <span><strong>Address:</strong> {user.address}</span>
                    </div>
                    <button onClick={() => handleApproveUser(user._id)} className="button button-approve">Approve User</button>
                </div>
            ))
        ) : (
            <p>There are no users to approve.</p>
        )}
        <h1>Approve Products</h1>
        <ul className="approval-list">
            {unapprovedProducts.length > 0 ? (
                unapprovedProducts.map(product => (
                    <li key={product._id}>
                        <img src={product.coverImg} alt={product.title} />
                        <div className="product-info">
                            <span>{product.title}</span>
                        </div>
                        <button className="button button-approve" onClick={() => handleApprove(product._id)}>Approve</button>
                        <button className="button button-delete" onClick={() => handleDelete(product._id)}>Delete</button>
                    </li>
                ))
            ) : (
                <p>There are no products to approve.</p>
            )}
        </ul>
    </div>
);


};
export default ApprovalPage;
