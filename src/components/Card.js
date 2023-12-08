import React, { useState } from "react";
import '../styles/card.css';
export default function Card(props) {
    let badgeText;
    if (props.openSpots === 0) {
        badgeText = "SOLD OUT";
    } else if (props.location === "Online") {
        badgeText = "ONLINE";
    }

    const [quantity, setQuantity] = useState(1);

    const addToCart = async () => {
        console.log(`Added product ${props.id} with quantity ${quantity} to cart.`);
        // Assuming a similar backend API structure as in MarketCard
        const productToAdd = { product_id: props.id, quantity: quantity };
        try {
            const response = await fetch('/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productToAdd),
                credentials: 'include'
            });

            if (response.status === 401) {
                window.location.href = '/login';
            } else if (response.ok) {
                alert('Added to cart!');
            } else {
                const errorData = await response.json();
                alert(`Failed to add to cart: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div className="card">
            {
                badgeText && 
                <div className="card--badge">{badgeText}</div>
            }
            <img 
                src={`../images/${props.coverImg}`} 
                className="card--image" 
                alt={props.title} 
            />
            <div className="card--details">
               <strong> <p className="card--title">{props.title}</p></strong>
                <p className="card--description">{props.description}</p>
                <p className="card--price">
                    <span className="bold">Rs. {props.price}</span>
                </p>
                <p className="card--stock">
                    {props.openSpots > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
                <div className="card-actions">
                    <button onClick={addToCart}>Add to Cart</button>
                    <input 
                        type="number" 
                        min="1" 
                        max={props.openSpots} // Use openSpots for max quantity
                        value={quantity} 
                        onChange={(e) => setQuantity(Number(e.target.value))} 
                        className="quantity-input"
                    />
                </div>
            </div>
        </div>
    );
}
