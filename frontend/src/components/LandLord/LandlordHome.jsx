import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandlordHome.css';
import Footer from '../Footer/Footer';
import Navbar from '../LandLord/NavBar/NavBar'
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Landlordheader from '../LandLord/Header/Header';

const LandlordHome = () => {
  const [userName, setUserName] = useState('');
  const [properties, setProperties] = useState([]);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeListings, setActiveListings] = useState(0);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.sub);
        setUserId(decoded.user_id);
        
        axios.get(`http://localhost:8000/landlord_properties/${decoded.user_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then((response) => {
            const propertiesData = response.data;
            setProperties(propertiesData);
            
            const active = propertiesData.filter(property => 
              parseInt(property.available_space || 0) != 0
            ).length;
            setActiveListings(active);
            
            return axios.get(`http://localhost:8000/student-details/${decoded.user_id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          })
          .then((studentResponse) => {
            setTotalStudents(studentResponse.data.length);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setError('Failed to load data');
            setLoading(false);
          });
      } catch (error) {
        console.error('Failed to decode token:', error);
        setError('Authentication error');
        setLoading(false);
      }
    } else {
      setError('No authentication token found');
      setLoading(false);
    }
  }, []);


  const totalProperties = properties.length;
  const totalAvailableSpaces = properties.reduce((sum, property) => 
    sum + parseInt(property.available_space || 0), 0
  );

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div><Navbar/>
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, {userName}!</h1>
        <Landlordheader/>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>Total Properties</h2>
          <p>{totalProperties}</p>
        </div>
        <div className="stat-card">
          <h2>Total Students</h2>
          <p>{totalStudents}</p>
        </div>
        <div className="stat-card">
          <h2>Available Spaces</h2>
          <p>{totalAvailableSpaces}</p>
        </div>
        <div className="stat-card">
          <h2>Active Listings</h2>
          <p>{activeListings}</p>
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
            onClick={() => handleNavigation('/Manage-students')}
          >
            View Students
          </button>
        </div>
        <div className="action-card">
          <h2>Manage Requests</h2>
          <p>Accept or Reject Students' requests.</p>
          <button 
            className="btn-view-plan"
            onClick={() => handleNavigation('/manage-requests')}
          >
            Manage Requests
          </button>
        </div>
      </div>
      <Footer/>
    </div>
    </div>
  );
};

export default LandlordHome;