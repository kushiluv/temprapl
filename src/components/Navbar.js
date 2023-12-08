import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async function checkSession() {
            try {
                const response = await fetch('/session');
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error checking session:", error);
            }
        })();
    }, []);
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

    const handleLogoutClick = async () => {
        try {
            const response = await fetch('/logout', { method: 'POST' });
            if (response.ok) {
                setUser(null);
                navigate("/");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav>
            <div className="left-buttons">
                <img 
                    src="../images/airbnb-logo.png" 
                    className="nav--logo" 
                    alt="Airbnb Logo" 
                    onClick={handleLogoClick}
                />
                <button className="login-button" onClick={handleMarketClick}>Market</button>
                <button className="login-button" onClick={handleListAnItemClick}>List an Item</button> {/* New button */}
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
