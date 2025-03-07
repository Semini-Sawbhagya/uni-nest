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
  }, []);

  const getAvailabilityColor = (available_space) => {
    const spaces = parseInt(available_space);
    if (spaces === 0) return 'bg-red-500';
    if (spaces <= 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredProperties = properties.filter(property =>
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProperties = properties.length;
  const totalAvailableSpaces = properties.reduce((sum, property) => 
    sum + parseInt(property.available_space || 0), 0
  );

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div> <Navbar />
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Properties</h1>
        <p className="text-gray-600">Welcome, {userName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Properties</h2>
          <p className="text-2xl">{totalProperties}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Available Spaces</h2>
          <p className="text-2xl">{totalAvailableSpaces}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Average Rating</h2>
          <p className="text-2xl">
            {(properties.reduce((sum, p) => sum + parseFloat(p.ratings || 0), 0) / properties.length || 0).toFixed(1)}⭐
          </p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by location or type..."
          className="w-full p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.boarding_id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={property.img || '/api/placeholder/400/200'}
              alt={`Property in ${property.location}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{property.location}</h3>
                <span className={`px-2 py-1 rounded-full text-white text-sm ${getAvailabilityColor(property.available_space)}`}>
                  {property.available_space} spaces
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600"><span className="font-semibold">Price Range:</span> {property.price_range}</p>
                <p className="text-gray-600"><span className="font-semibold">Type:</span> {property.type}</p>
                <p className="text-gray-600"><span className="font-semibold">Security:</span> {property.security}</p>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Rating:</span>
                  <span>{property.ratings}⭐</span>
                </div>
                {property.review && (
                  <p className="text-gray-600 text-sm italic">"{property.review}"</p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No properties found matching your search criteria.
        </div>
      )}
    </div>
    </div>
  );
};

export default PropertyListing;