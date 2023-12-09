import React, { useState } from "react"

export default function Card(props) {
    let badgeText
    if (props.openSpots === 0) {
        badgeText = "SOLD OUT"
    } else if (props.location === "Online") {
        badgeText = "ONLINE"
    }

    const [quantity, setQuantity] = useState(1);

    const addToCart = () => {
        console.log(`Added product ${props.id} with quantity ${quantity} to cart.`);
        // Implement the actual add to cart logic here
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
            <div className="card--stats">
                <img src="../images/star.png" className="card--star" alt="star-icon" />
                <span>{props.stats.rating}</span>
                <span className="gray">({props.stats.reviewCount}) • </span>
                <span className="gray">{props.location}</span>
            </div>
            <p className="card--title">{props.title}</p>
            <p className="card--price">
                <span className="bold">From ${props.price}</span> / person
            </p>
            <div className="card-actions">
                <button onClick={addToCart}>Add to Cart</button>
                <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
        </div>
    )
}
