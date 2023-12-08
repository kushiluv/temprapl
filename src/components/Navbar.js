import React, { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    // Simulate a user login with hardcoded values
    const loginUser = () => {
        
        setUser({ username: "abhinn" });
        
    };

    // Simulate user logout
    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem("user"); // Clear user data from local storage
        navigate("/login"); // Navigate to the login page after logout
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleListAnItemClick = () => {
        if (user) {
            navigate("/sell");
        } else {
            navigate("/login");
        }
    };

    const handleLoginClick = () => {
        navigate("/login");
        
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    const handleMarketClick = () => {
        navigate("/market");
    };

    const handleUserClick = () => {
        navigate("/profile");
    };

    const handleCartClick = () => {
        navigate("/cart");
    };

    const handleLogoutClick = () => {
        logoutUser(); // Simulate logout
    };

    return (
        <nav>
            <div className="left-buttons">
                <img 
                    src="../images/airbnb-logo.png" 
                    className="nav--logo" 
                    alt="Logo" 
                    onClick={handleLogoClick}
                />
                <button className="login-button" onClick={handleMarketClick}>Market</button>
                <button className="login-button" onClick={handleListAnItemClick}>List an Item</button>
            </div>
            <div className="login">
                {user ? (
                    <>
                        <button className="userName" onClick={handleUserClick}>{user.username}</button>
                        <button className="login-button" onClick={handleCartClick}>Cart</button>
                        <button className="logout-button" onClick={handleLogoutClick}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className="login-button" onClick={handleLoginClick}>Login</button>
                        <button className="register-button" onClick={handleRegisterClick}>Register</button>
                    </>
                )}
            </div>
        </nav>
    );
}
