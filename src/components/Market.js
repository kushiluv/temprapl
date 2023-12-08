import React, { useState } from 'react';
import MarketCard from "../components/MarketCard"; // Import the MarketCard component
import '../styles/Market.css';
import Navbar from '../components/Navbar';
import data from "../data"; // Import data from data.js

export default function Market() {
    const [products] = useState(data);
    const [filter, setFilter] = useState("");

    // Add function to handle adding to cart
    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.title} added to cart.`);
    };

    let filteredData = [...products];

    switch (filter) {
        case "1":
            filteredData.sort((a, b) => b.price - a.price);
            break;
        case "2":
            filteredData.sort((a, b) => a.price - b.price);
            break;
        case "3":
                // First filter out products with no open spots, then sort by open spots in descending order
                filteredData = filteredData.filter(item => item.openSpots > 0);
                filteredData.sort((a, b) => b.openSpots - a.openSpots);
                break;
        case "4":
            filteredData.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            break;
    }

    const cards = filteredData.map(item => {
        return (
            <li className="market-item" key={item.id}>
                <MarketCard {...item} addToCart={() => addToCart(item)} />
            </li>
        );
    });

    return (
        <div className='bruh'>
            <Navbar />
            <div className="market-container" >
                <div className="market-filters">
                    <form>
                        <button className="filter-button" type="submit">Filter</button>
                        <select className="btn btn-light dropdown-toggle" 
                                name="filter" 
                                value={filter} 
                                onChange={e => setFilter(e.target.value)}>
                            <option value="" disabled hidden>Select from the dropdown</option>
                            <option value="1">Price [High to low]</option>
                            <option value="2">Price [Low to high]</option>
                            <option value="3">In Stock</option>
                            <option value="4">Name</option>
                        </select>
                    </form>
                </div>
                <div className="market-listings">
                    <ul className="list-unstyled">
                        {cards}
                    </ul>
                </div>
            </div>
        </div>
    );
}
