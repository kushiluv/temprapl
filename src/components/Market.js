import React, { useState, useEffect} from 'react';
import MarketCard from "../components/MarketCard"; // Import the new MarketCard component
import '../styles/Market.css';
import Navbar from '../components/Navbar';
export default function Market() {
    
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        // Fetch the products when the component mounts
        const fetchProducts = async () => {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                
            } else {
                // Handle errors here
                const errorData = await response.json();
                console.log('Failed to fetch products:', errorData.error);
            }
        };

        fetchProducts();
    }, []);

    let filteredData = [...products];

    switch (filter) {
        case "1":
            filteredData.sort((a, b) => b.price - a.price);
            break;
        case "2":
            filteredData.sort((a, b) => a.price - b.price);
            break;
        case "3":
            filteredData.sort((a, b) => b.stock - a.stock);
            break;
        case "4":
            filteredData.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            break;
    }

    const cards = filteredData.map(item => {
        
        return (
            <li className="market-item" key={item._id}>
                <MarketCard {...item} />
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
