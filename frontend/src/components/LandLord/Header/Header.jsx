import React, { useEffect, useState } from 'react';
import './Header.css'
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
const Landlordheader = () => {
  const [userName,setUserName]=useState('');
  useEffect(() => {
      const token = Cookies.get('accessToken'); 
      if (token) {
        try {
          const decoded = jwtDecode(token);
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
      </header>
    <div className='Landlordheader'>
      <div className="Landlordheader-content">
        <h2>List Your Bordings Here</h2>
        <p>Unlock the potential of your property by connecting with university students seeking comfortable accommodations! List your boarding space on our platform to reach a wider audience, manage inquiries effortlessly, and find the perfect tenants. Start hosting today and make the most of your rental space!</p>
       
      </div>
    </div>
    </div>
  )
}

export default Landlordheader
