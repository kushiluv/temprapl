import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/Cart.css';

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
        const fetchCartItems = async () => {
            try {
                const response = await fetch('/cart', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Credentials': 'include'
                    }
                });

                if (response.ok) {
                    const items = await response.json();
                    console.log(items)
                    setCartItems(items.map(item => ({
                        ...item,
                        product_id: item.product_id.$oid // Transform ObjectId to string
                    })));
                    // Calculate total price
                    const total = items.reduce((acc, item) => acc + (item.quantity * item.product_price), 0);
                    setTotalPrice(total);
                } else if (response.status === 401) {
                    navigate('/login');
                } else {
                    throw new Error('Problem fetching cart items.');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCartItems();
    }, [navigate]);

    const removeFromCart = async (cartId) => {
        try {
            const response = await fetch(`/cart/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Credentials': 'include'
                }
            });

            if (response.ok) {
                setCartItems(currentItems =>
                    currentItems.filter(item => item._id !== cartId)
                );
            } else {
                throw new Error('Problem removing item from cart.');
            }
        } catch (err) {
            setError(err.message);
        }
    };
    const placeOrder = async () => {
        // Calculate total amount in the smallest currency unit (e.g., paise for INR)
        const amount = totalPrice * 100; // Assuming totalPrice is in dollars

        // Prepare the options for Razorpay
        const options = {
            key: "rzp_test_WyK93y9mvps7SN", // Replace with your Razorpay key
            amount: amount.toString(),
            currency: "INR",
            name: "Your Company Name",
            description: "Payment for Order",
            // image: "vk.jpg", // Provide image url if you have one
            handler: function(response) {
                // Handle the payment success
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

        // Instantiate Razorpay and open the payment modal
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handlePaymentSuccess = async (paymentId, orderId) => {
        console.log('Payment Successful', paymentId, orderId);
    
        // Call backend to create an order
        try {
            const response = await fetch('/create_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: cartItems, // Assuming cartItems is your list of products
                    total_price: totalPrice,
                }),
            });
    
            if (response.ok) {
                console.log("Order created successfully");
                // Redirect to the profile page
                navigate('/profile', { state: { paymentSuccess: true } });
            } else {
                throw new Error('Failed to create order');
            }
        } catch (err) {
            console.error("Error creating order:", err.message);
        }
    };
    
    
    if (error) {
        return <div className="cart-error">{error}</div>;
    }

    return (
        <>
        <Navbar />
        
        <div className="cart-container">
            <h1>Your Cart</h1>
            {cartItems.length > 0 ? (
                <>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item._id}>
                                <img src={item.coverImg} alt={item.product_name} /> {/* Update the src to use the URL */}
                                <span>{item.product_name}</span> - <span>{item.quantity}</span> x <span>Rs. {item.product_price ? item.product_price.toFixed(2) : '0.00'}</span>
                                <button onClick={() => removeFromCart(item._id)}>Remove</button>
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
