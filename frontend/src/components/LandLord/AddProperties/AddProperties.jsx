import React, { useState } from 'react';
import './AddProperties.css';

const AddPropertyPage = () => {
  const [formData, setFormData] = useState({
    uni_id: '',
    landlord_id: '',
    img: '',
    price_range: '',
    location: '',
    ratings: '',
    review: '',
    type: '',
    security: '',
    available_space: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Property added:', formData);
    // Here, you would add a backend API call to save the data to your database
  };

  return (
    <div className="add-property-container">
      <h1 className="add-property-title">Add New Property</h1>
      <form className="add-property-form" onSubmit={handleSubmit}>
        <label htmlFor="uni_id">University ID:</label>
        <input
          type="text"
          id="uni_id"
          name="uni_id"
          value={formData.uni_id}
          onChange={handleChange}
          required
        />

        <label htmlFor="landlord_id">Landlord ID:</label>
        <input
          type="text"
          id="landlord_id"
          name="landlord_id"
          value={formData.landlord_id}
          onChange={handleChange}
          required
        />

        <label htmlFor="img">Image URL:</label>
        <input
          type="text"
          id="img"
          name="img"
          value={formData.img}
          onChange={handleChange}
        />

        <label htmlFor="price_range">Price Range:</label>
        <input
          type="text"
          id="price_range"
          name="price_range"
          value={formData.price_range}
          onChange={handleChange}
          required
        />

        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label htmlFor="ratings">Ratings (out of 5):</label>
        <input
          type="number"
          id="ratings"
          name="ratings"
          value={formData.ratings}
          onChange={handleChange}
          min="0"
          max="5"
          step="0.1"
        />

        <label htmlFor="review">Review:</label>
        <textarea
          id="review"
          name="review"
          value={formData.review}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="type">Type:</label>
        <input
          type="text"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />

        <label htmlFor="security">Security Details:</label>
        <textarea
          id="security"
          name="security"
          value={formData.security}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="available_space">Available Space:</label>
        <input
          type="number"
          id="available_space"
          name="available_space"
          value={formData.available_space}
          onChange={handleChange}
          required
        />

        <button type="submit" className="add-property-btn">Add Property</button>
      </form>
    </div>
  );
};

export default AddPropertyPage;
