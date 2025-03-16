
import React, { useState, useEffect } from 'react';
import './NavBar.css';
import logo from '../../../assets/logo.png';
import { Link } from 'react-router-dom';
import search_icon from '../../../assets/search_icon.png';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext'


const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const navigate = useNavigate();
  const {logout} = useAuth();

  const [userId, setUserId] = useState('');
  const [boardingId, setBoardingId] = useState('');


  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
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



  return (
    <div className='navbar'>
      <Link to='/'><img src={logo} alt="logo" className="logo"/></Link>
      <ul className="navbar-menu">
        <Link to='/landlord-home' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <Link to='/add-properties' onClick={() => setMenu("add-properties")} className={menu === "add-properties" ? "active" : ""}>Add Properties</Link>
        <Link to='/Manage-students' onClick={() => setMenu("Manage-students")} className={menu === "Manage-students" ? "active" : ""}>Manage Students</Link>
        
        {/* Pass the dynamic boardingId in the URL */}
        <Link 
          to='/properties'  
          onClick={() => setMenu("properties")}
          className={menu === "properties" ? "active" : ""}
        >
          My Boardings
        </Link>
        
        <a href='#app-download' onClick={() => setMenu("about-us")} className={menu === "about-us" ? "active" : ""}>About Us</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
      </ul>
      
      <div className="navbar-right">
        <img src={search_icon} alt="search icon" />
        <button>Sign In</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );

}
export default Navbar;
