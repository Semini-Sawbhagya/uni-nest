import React from 'react'
import './Footer.css';
import facebook_icon from '../../assets/facebook_icon.png';
import twitter_icon from '../../assets/twitter_icon.png';
import linkedin_icon from '../../assets/linkedin_icon.png';
import logo from '../../assets/logo.png';
const Footer = () => {
  return (
    <div className='footer' id='footer'>  
      <div className='footer-content'>
        <div className='footer-content-left'>
          <img src={logo} alt="" />
          <p>Find Your Perfect Boarding Place
          Discover the ideal place to stay during your university journey. Our platform helps students easily find comfortable, affordable, and well-located accommodations near their campus. Browse listings, compare prices, and secure your perfect boarding spot with just a few clicks. Start your search today and make your university experience even better!</p>
          <div className='footer-social-icons'>
            <img src={facebook_icon} alt="" />
            <img src={twitter_icon} alt="" />
            <img src={linkedin_icon} alt="" />
          </div>
        </div>
        <div className='footer-content-center'>
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className='footer-content-right'>
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>Address: 123 Street Name, Galle, Sri Lanka</li>
            <li>Phone: +94774529087</li>
            <li>uninest@gmail.com:</li>
          </ul>
        </div>
        
      </div>
      <hr />
      <p className='footer-copyright'>Copyright 2025 © UniNest.com - All Right Rserved.</p>
    </div>
  )
}

export default Footer
