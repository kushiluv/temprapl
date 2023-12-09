import React, { useState } from "react";
import '../styles/MarketCard.css';

export default function MarketCard(props) {
    const [quantity, setQuantity] = useState(1);

    const addToCart = async () => {
        console.log(props._id);
        const productToAdd = { product_id: props._id, quantity: quantity };
        // Check for user authentication status before adding to cart
        const response = await fetch('/https://ritflaskapp.azurewebsites.net/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productToAdd),
            credentials: 'include'
        });

        if (response.status === 401) {
            // Redirect to login
            window.location.href = '/login'; // or use React Router's useNavigate()
        } else if (response.ok) {
            // Successfully added to cart
            alert('Added to cart!');
        } else {
            
            // Handle any other errors
            const errorData = await response.json();
            alert(`Failed to add to cart: ${errorData.error}`);
        }
    };

    return (
        <div className="market-card">
            <img 
                src={props.coverImg} // Use the image URL directly from props
                className="market-card--image" 
                alt={props.title} 
            />
            <div className="market-card--details">
                
                <p className="market-card--title">{props.title}</p>
                
                <p className="market-card--description">{props.description}</p>
                
                <p className="market-card--price">
                    <span className="bold">Rs. {props.price}</span>
                </p>
                
                <p className="market-card--stock">
                    {props.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
                
                <div className="market-card-actions">
                    <button onClick={addToCart}>Add to Cart</button>
                    <input 
                        type="number" 
                        min="1" 
                        max={props.stock} // Assuming you have a 'stock' prop that holds the available quantity
                        value={quantity} 
                        onChange={(e) => setQuantity(Number(e.target.value))} 
                        className="quantity-input"
                    />
                </div>
            </div>
        </div>
    );
}
