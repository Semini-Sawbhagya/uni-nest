import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/NavBar'
import Footer from '../../Footer/Footer';
import './ManageRequests.css';

const ManageRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user_id, setUserId] = useState('');
  const navigate = useNavigate();

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    const token = Cookies.get('accessToken');
    if (!token) {
      setError('No authentication token found');
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.user_id);
      const response = await axios.get(`http://localhost:8000/pending_requests/${decoded.user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPendingRequests(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setError('Failed to fetch pending requests');
      setIsLoading(false);
    }
  };

  // Handle request update (accept/reject)
  const handleRequestUpdate = async (id, status) => {
    const token = Cookies.get('accessToken');
    if (!token) {
      alert('Authentication token expired. Please log in again.');
      return;
    }

    try {
      await axios.put(`http://localhost:8000/update-request/${id}/${status}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== id));
      alert(`Request ${status}ed successfully`);
    } catch (error) {
      console.error(`Error ${status}ing request:`, error);
      alert(`Failed to ${status} request`);
    }
  };

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      jwtDecode(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      navigate('/login');
      return;
    }

    fetchPendingRequests();
  }, [navigate]);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="manage-requests-container">
          <h2>Pending Requests</h2>
          <p>Loading requests...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="manage-requests-container error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="manage-requests-container">
          <h2>Pending Requests</h2>
          <p>No pending requests at the moment.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="manage-requests-container">
        <h2>Manage Requests</h2>
        <table className="manage-requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Boarding ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.user_name}</td>
                <td>{request.boarding_id}</td>
                <td>
                  <div className="manage-requests-actions">
                    <button className="manage-requests-accept" onClick={() => handleRequestUpdate(request.id, 'approved')}>
                      Accept
                    </button>
                    <button className="manage-requests-reject" onClick={() => handleRequestUpdate(request.id, 'rejected')}>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default ManageRequests;