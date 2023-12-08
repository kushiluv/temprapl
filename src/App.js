import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sampleitems from './components/Sampleitems';
import Page3 from './components/Page3';
import Register from './components/RRegister'; // Make sure the component is correctly imported
import Login from './components/Login'; // Make sure the component is correctly imported
import Market from './components/Market';
import Profile from './components/Profile';
import Cart from './components/Cart';
import Sell from './components/Sell';
import ApprovalPage from './components/ApprovalPage';
import './style.css';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/market" element={<Market />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/ApprovalPage" element={<ApprovalPage />} />
        </Routes>
      </div>
    </Router>
  );

  function HomeComponent() {
    return (
      <div className="scroll-container">
        <Navbar />
        <div className="scroll-section">
          <Hero />
        </div>
        <div className="scroll-section">
          <Sampleitems />
        </div>
      </div>
    );
  }
}
