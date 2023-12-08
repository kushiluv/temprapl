import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import '../styles/Cart.css';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadScript = (src) => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    resolve(true);
                };
                script.onerror = () => {
                    resolve(false);
                };
                document.body.appendChild(script);
            });
        };

        // Load Razorpay script on component mount
        loadScript('https://checkout.razorpay.com/v1/checkout.js');

        // Load cart items from local storage
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCartItems);

        // Calculate total price
        const total = storedCartItems.reduce((acc, item) => {
            const price = parseFloat(item.price); // Ensure price is a number
            return acc + (item.quantity * (isNaN(price) ? 0 : price));
        }, 0);
        setTotalPrice(total);
    }, []);

    const removeFromCart = (productId) => {
        const updatedCartItems = cartItems.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);

        // Recalculate total price
        const total = updatedCartItems.reduce((acc, item) => {
            const price = parseFloat(item.price);
            return acc + (item.quantity * (isNaN(price) ? 0 : price));
        }, 0);
        setTotalPrice(total);
    };

    const placeOrder = () => {
        const amount = totalPrice * 100; // Assuming totalPrice is in rupees, convert to paise

        const options = {
            key: "rzp_test_WyK93y9mvps7SN", // Replace with your Razorpay key
            amount: amount.toString(),
            currency: "INR",
            name: "Your Company Name",
            description: "Payment for Order",
            handler: function(response) {
                handlePaymentSuccess(response.razorpay_payment_id, response.razorpay_order_id);
            },
            prefill: {
                name: "Customer Name",
                email: "customer@example.com",
                contact: "9999999999"
            },
            notes: {
                shopping_order_id: "21" // Replace with actual shopping order ID
            },
            theme: {
                color: "#3399cc"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handlePaymentSuccess = async (paymentId, orderId) => {
        console.log('Payment Successful', paymentId, orderId);
        // Further logic after successful payment
        // Redirect to profile or order confirmation page
        navigate('/profile', { state: { paymentSuccess: true } });
    };

    if (error) return <div className="cart-error">{error}</div>;

    return (
        <>
            <Navbar />
            <div className="cart-container">
                <h1>Your Cart</h1>
                {cartItems.length > 0 ? (
                    <>
                        <ul>
                            {cartItems.map(item => (
                                <li key={item.id}>
                                    <img 
                src={`../images/${item.coverImg}`} 
                className="card--image" 
                alt={item.title} 
            />
                                    <span>{item.title}</span> - <span>{item.quantity}</span> x <span>Rs. {(parseFloat(item.price) || 0).toFixed(2)}</span>
                                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-total">
                            <strong>Total Price: Rs. {totalPrice.toFixed(2)}</strong>
                        </div>
                        <button className="place-order-button" onClick={placeOrder}>Place Order</button>
                    </>
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>
        </>
    );
}
