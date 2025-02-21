import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandlordHome.css';
import Footer from '../Footer/Footer';
import Navbar from '../Student/NavBar/NavBar';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const LandlordHome = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.sub);
        setUserId(decoded.user_id);
        setRole(decoded.role);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.log('Token not found in cookies.');
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <Navbar/>
        <h1>Welcome back, {userName}!</h1>
        <p>Manage your properties and students from one place.</p>
      </header>

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

      <div className="actions-grid">
        <div className="action-card">
          <h2>Manage Properties</h2>
          <p>View and manage your boarding places.</p>
          <button 
            className="btn-view-properties"
            onClick={() => handleNavigation('/properties')}
          >
            View Properties
          </button>
        </div>
        <div className="action-card">
          <h2>Add New Property</h2>
          <p>List a new boarding place.</p>
          <button 
            className="btn-add-property"
            onClick={() => handleNavigation('/add-properties')}
          >
            Add Property
          </button>
        </div>
        <div className="action-card">
          <h2>Manage Students</h2>
          <p>View and manage student assignments.</p>
          <button 
            className="btn-view-students"
            onClick={() => handleNavigation('/add-properties')}
          >
            View Students
          </button>
        </div>
        <div className="action-card">
          <h2>Subscription Plan</h2>
          <p>View or upgrade your current plan.</p>
          <button 
            className="btn-view-plan"
            onClick={() => handleNavigation('/packages')}
          >
            View Plan
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default LandlordHome;