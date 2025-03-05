import React, { useState, useEffect } from 'react';
import './NavBar.css';
import logo from '../../../assets/logo.png';
import { Link } from 'react-router-dom';
import search_icon from '../../../assets/search_icon.png';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [boardingId, setBoardingId] = useState('');

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = Cookies.get('accessToken'); 
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);  // ✅ Debugging: Check if token is decoded correctly
        setUserId(decoded.user_id);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.log('Token not found in cookies.');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchBoardingId(userId);
    }
  }, [userId]);

  const fetchBoardingId = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/get-my-boarding-id/${userId}`);
      console.log("API Response:", response.data);  // ✅ Debugging: Check if API returns correct data
      setBoardingId(response.data.my_boarding_id); 
    } catch (error) {
      console.error("Error fetching boarding ID:", error);
    }
  };

  return (
    <div className='navbar'>
      <Link to='/'><img src={logo} alt="logo" className="logo"/></Link>
      <ul className="navbar-menu">
        <Link to='/home' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <Link to='/payment' onClick={() => setMenu("payment")} className={menu === "payment" ? "active" : ""}>Payment</Link>
        
        {/* Pass the dynamic boardingId in the URL */}
        <Link 
          to={boardingId ? `/my-boarding/${boardingId}` : "#"}  
          onClick={() => setMenu("profile")}
          className={menu === "profile" ? "active" : ""}
        >
          My Boarding
        </Link>
        <Link to='/review-rating' onClick={() => setMenu("review-rating")} className={menu === "review-rating" ? "active" : ""}>Reviews & Ratings</Link>
        <a href='#app-download' onClick={() => setMenu("about-us")} className={menu === "about-us" ? "active" : ""}>About Us</a>
        
      </ul>
      
      <div className="navbar-right">
        <img src={search_icon} alt="search icon" />
        <button>Sign In</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
