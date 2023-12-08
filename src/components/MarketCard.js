import React, { useState } from "react";
import '../styles/MarketCard.css';

export default function MarketCard(props) {
    const [quantity, setQuantity] = useState(1);

    const addToCart = () => {
        // Add to cart logic using local storage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ ...props, quantity: quantity });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${props.title} added to cart with quantity ${quantity}.`);
    };

    return (
        <div className="market-card">
            <img 
                src={`../images/${props.coverImg}`}
                className="market-card--image" 
                alt={props.title} 
            />
            <div className="market-card--details">
                <strong><p className="market-card--title">{props.title}</p></strong>
                <p className="market-card--description">{props.description}</p>
                <p className="market-card--price">
                    <span className="bold">Rs. {props.price}</span>
                </p>
                <p className="market-card--stock">
                    {props.openSpots > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
                <div className="market-card-actions">
                    <button onClick={addToCart}>Add to Cart</button>
                    <input 
                        type="number" 
                        min="1" 
                        max={props.stock} 
                        value={quantity} 
                        onChange={(e) => setQuantity(Number(e.target.value))} 
                        className="quantity-input"
                    />
                </div>
            </div>
        </div>
    );
}
