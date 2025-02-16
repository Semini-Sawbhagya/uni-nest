import React, { useEffect } from 'react';
import './LandlordHome.css';
import Footer from '../Footer/Footer';
import Navbar from '../Student/NavBar/NavBar';
import Cookies from 'js-cookie';
// Import jwt-decode properly
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';

const LandlordHome = () => {
  // Move token logic into useEffect
    const [userName,setUserName] = useState('')
    const [userId,setUserId] = useState('')
    const [role,setRole] = useState('')

  useEffect(() => {
    const token = Cookies.get('accessToken');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.user_id;
        const role = decoded.role;
        const userName = decoded.sub;
        setUserName(userName)
        setUserId(userId)
        setRole(role)
        
        console.log('User ID:', userId);
        console.log('Role:', role);
        
       /* if (userId) {
          fetch(`/get_landlord_details/${userId}`)
            .then((response) => response.json())
            .then((data) => {
              console.log('User Details:', data);
            });
        } */
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.log('Token not found in cookies.');
    }
  }, []); 
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <Navbar/>
        <h1>Welcome back, {userName}!</h1>
        <p>Manage your properties and students from one place.</p>
      </header>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <h2>Total Properties</h2>
          <p>3</p>
        </div>
        <div className="stat-card">
          <h2>Total Students</h2>
          <p>15</p>
        </div>
        <div className="stat-card">
          <h2>Available Spaces</h2>
          <p>5</p>
        </div>
        <div className="stat-card">
          <h2>Active Listings</h2>
          <p>3</p>
        </div>
      </div>

      {/* Actions Section */}
      <div className="actions-grid">
        <div className="action-card">
          <h2>Manage Properties</h2>
          <p>View and manage your boarding places.</p>
          <button className="btn-view-properties">View Properties</button>
        </div>
        <div className="action-card">
          <h2>Add New Property</h2>
          <p>List a new boarding place.</p>
          <button className="btn-add-property">Add Property</button>
        </div>
        <div className="action-card">
          <h2>Manage Students</h2>
          <p>View and manage student assignments.</p>
          <button className="btn-view-students">View Students</button>
        </div>
        <div className="action-card">
          <h2>Subscription Plan</h2>
          <p>View or upgrade your current plan.</p>
          <button className="btn-view-plan">View Plan</button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default LandlordHome;