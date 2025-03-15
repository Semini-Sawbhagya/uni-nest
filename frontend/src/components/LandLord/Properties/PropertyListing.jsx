import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './PropertyListing.css';
import Navbar from '../NavBar/NavBar';

const PropertyListing = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    location: '',
    price_range: '',
    type: '',
    security: '',
    available_space: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
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
            setProperties(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching properties:', error);
            setError('Failed to load properties');
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
  };

  // Delete functionality
  const handleDeleteClick = (property) => {
    setSelectedProperty(property);
    setConfirmDelete(true);
  };

  const confirmDeleteProperty = async () => {
    if (!selectedProperty) return;
    
    try {
      const token = Cookies.get('accessToken');
      await axios.delete(`http://localhost:8000/delete-boarding/${selectedProperty.boarding_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove property from state
      setProperties(properties.filter(p => p.boarding_id !== selectedProperty.boarding_id));
      setConfirmDelete(false);
      setSelectedProperty(null);
    } catch (err) {
      setError('Failed to delete property: ' + (err.response?.data?.detail || err.message));
      console.error('Error deleting property:', err);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
    setSelectedProperty(null);
  };

  // Edit functionality
  const handleEditClick = (property) => {
    setSelectedProperty(property);
    setEditFormData({
      location: property.location || '',
      price_range: property.price_range || '',
      type: property.type || '',
      security: property.security || '',
      available_space: property.available_space || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    
    if (!selectedProperty) return;
    
    try {
      const token = Cookies.get('accessToken');
      const response = await axios.put(
        `http://localhost:8000/update-boarding/${selectedProperty.boarding_id}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update property in the state
      setProperties(properties.map(property => 
        property.boarding_id === selectedProperty.boarding_id 
          ? { ...property, ...editFormData } 
          : property
      ));
      
      // Close modal and reset form
      setIsEditModalOpen(false);
      setSelectedProperty(null);
    } catch (err) {
      setError('Failed to update property: ' + (err.response?.data?.detail || err.message));
      console.error('Error updating property:', err);
    }
  };

  const cancelEdit = () => {
    setIsEditModalOpen(false);
    setSelectedProperty(null);
  };

  const getAvailabilityBadgeClass = (available_space) => {
    const spaces = parseInt(available_space);
    if (spaces === 0) return 'availability-badge availability-badge-red';
    if (spaces <= 2) return 'availability-badge availability-badge-yellow';
    return 'availability-badge availability-badge-green';
  };

  const filteredProperties = properties.filter(property =>
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProperties = properties.length;
  const totalAvailableSpaces = properties.reduce((sum, property) => 
    sum + parseInt(property.available_space || 0), 0
  );

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="header-section">
          <h1>My Properties</h1>
          <p>Welcome, {userName}</p>
        </div>

        <div className="stats-grid1">
          <div className="stat-card1">
            <h2>Total Properties</h2>
            <p>{totalProperties}</p>
          </div>
          <div className="stat-card1">
            <h2>Available Spaces</h2>
            <p>{totalAvailableSpaces}</p>
          </div>
          <div className="stat-card1">
            <h2>Average Rating</h2>
            <p>
              {(properties.reduce((sum, p) => sum + parseFloat(p.ratings || 0), 0) / properties.length || 0).toFixed(1)}⭐
            </p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by location or type..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="property-grid">
          {filteredProperties.map((property) => (
            <div key={property.boarding_id} className="property-card">
              <img
                src={property.img || '/api/placeholder/400/200'}
                alt={`Property in ${property.location}`}
                className="property-image"
              />
              <div className="property-content">
                <div className="property-header">
                  <h3 className="property-title">{property.location}</h3>
                  <span className={getAvailabilityBadgeClass(property.available_space)}>
                    {property.available_space} spaces
                  </span>
                </div>
                <div className="property-details">
                  <p><span className="label">Price Range:</span> {property.price_range}</p>
                  <p><span className="label">Type:</span> {property.type}</p>
                  <p><span className="label">Security:</span> {property.security}</p>
                  <div>
                    <span className="label">Rating:</span>
                    <span>{property.ratings}⭐</span>
                  </div>
                  {property.review && (
                    <p className="property-review">"{property.review}"</p>
                  )}
                </div>
                <div className="property-actions">
                  <button 
                    className="btn btn-edit"
                    onClick={() => handleEditClick(property)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-delete"
                    onClick={() => handleDeleteClick(property)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="empty-state">
            No properties found matching your search criteria.
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && selectedProperty && (
          <div className="modal-overlay">
            <div className="modal">
              <h3 className="modal-title">Confirm Delete</h3>
              <p className="modal-message">Are you sure you want to delete property at {selectedProperty.location}?</p>
              <div className="modal-actions">
                <button 
                  className="btn-cancel"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button 
                  className="btn-confirm"
                  onClick={confirmDeleteProperty}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Property Modal */}
        {isEditModalOpen && selectedProperty && (
          <div className="modal-overlay">
            <div className="modal edit-modal">
              <h3 className="modal-title">Edit Property</h3>
              <form onSubmit={submitEditForm}>
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price_range">Price Range</label>
                  <input
                    type="text"
                    id="price_range"
                    name="price_range"
                    value={editFormData.price_range}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={editFormData.type}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Room">Room</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="security">Security</label>
                  <select
                    id="security"
                    name="security"
                    value={editFormData.security}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="">Select Security Level</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="available_space">Available Spaces</label>
                  <input
                    type="number"
                    id="available_space"
                    name="available_space"
                    value={editFormData.available_space}
                    onChange={handleEditInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button 
                    type="button"
                    className="btn-cancel"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-confirm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListing;