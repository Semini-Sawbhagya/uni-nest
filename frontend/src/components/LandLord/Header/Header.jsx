import React, { useEffect, useState } from 'react';
import './Header.css'
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
const header = () => {
  const [userName,setUserName]=useState('');
  useEffect(() => {
      const token = Cookies.get('accessToken'); 
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log("Decoded token:", decoded);  // ✅ Debugging: Check if token is decoded correctly
          setUserName(decoded.sub);
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      } else {
        console.log('Token not found in cookies.');
      }
    }, []);
  return (
    <div>
    <header className="dashboard-header">
        <h1>Welcome back, {userName}!</h1>
      </header>
    <div className='header'>
      <div className="header-content">
        <h2>Find Your Bording Here</h2>
        <p>Find the perfect boarding place for your university life with ease! Our platform connects students with comfortable, affordable, and convenient accommodations near their campus. Browse listings, compare options, and secure your ideal stay hassle-free. Start your search today!</p>
        <button>View Menu</button>
      </div>
    </div>
    </div>
  )
}

export default header

