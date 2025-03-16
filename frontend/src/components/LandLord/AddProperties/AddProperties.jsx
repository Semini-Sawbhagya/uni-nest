import React, { useState, useEffect } from 'react';
import './AddProperties.css';
import Navbar from '../NavBar/NavBar';
import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const AddPropertyPage = () => {
  const [universities, setUniversities] = useState([]);
  const [types, setTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [userId, setUserId] = useState('');
  
  const [formData, setFormData] = useState({
    uni_id: '',
    landlord_userId: '',
    img: '',
    price_range: '',
    location: '',
    type: '',
    security: '',
    available_space: ''
  });

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
          try {
            const decoded = jwtDecode(token);
            setUserId(decoded.user_id);
            formData.landlord_userId = decoded.user_id;
          } catch (error) {
            console.error('Failed to decode token:', error);
            setError('Authentication error');
          }
        } else {
          setError('No authentication token found');
    }
    const fetchUniversities = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/universities");
        console.log("Universities state:", universities);
        setUniversities(response.data);
      } catch (err) {
        console.error("Error fetching universities:", err);
        setError("Failed to load universities.");
      }
    };
    
    const fetchTypes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/types");
        console.log("Types from API:", response.data);
        setTypes(response.data); 
      } catch (err) {
        console.error("Error fetching types:", err);
        setError("Failed to load types.");
      }
    };
    
    const fetchPrice_Range = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/price-ranges");
        console.log("Price ranges from API:", response.data);
        setPriceRange(response.data); 
      } catch (err) {
        console.error("Error fetching price-range:", err);
        setError("Failed to load price-range.");
      }
    };
    
    fetchUniversities();
    fetchTypes();
    fetchPrice_Range();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;
    
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', imageFile);
    
    try {
      // Replace with your FastAPI endpoint
      const response = await axios.post('http://127.0.0.1:8000/upload-image/', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUploading(false);
      return response.data.url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // First upload the image to Cloudinary if there's an image file
    let updatedFormData = { ...formData };
    
    if (imageFile) {
      const imageUrl = await uploadImageToCloudinary();
      if (imageUrl) {
        updatedFormData = {
          ...formData,
          img: imageUrl
        };
      }
    }
    
    console.log('Property added:', updatedFormData);
    
    try {
      await axios.post(`http://127.0.0.1:8000/properties`, updatedFormData);
      alert('Property added successfully!');
      setFormData({
        uni_id: '',
        landlord_userId: '',
        img: '',
        price_range: '',
        location: '',
        type: '',
        security: '',
        available_space: ''
      });
      setImageFile(null);
      setPreviewUrl('');
    } catch (err) {
      console.error("Error adding property:", err);
      setError("Failed to add property.");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div> 
      <Navbar />
      <div className="add-property-container">
        <h1 className="add-property-title">Add New Property</h1>
        {error && <div className="error-message">{error}</div>}
        <form className="add-property-form" onSubmit={handleSubmit}>
          <label htmlFor="uni_id">Nearest University:</label>
          <select
            id="uni_id"
            name="uni_id"
            value={formData.uni_id}
            onChange={handleChange}
            required
            className="form-dropdown"
          >
            <option value="">Select a university</option>
            {universities.map((uni) => (
              <option key={uni.uni_id} value={uni.uni_id}>
                {uni.name}
              </option>
            ))}
          </select>

          <label htmlFor="propertyImage">Property Image:</label>
          <div className="image-upload-container">
            <input
              type="file"
              id="propertyImage"
              name="propertyImage"
              accept="image/*"
              onChange={handleImageSelect}
              className="image-input"
            />
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Property preview" />
              </div>
            )}
          </div>

          <label htmlFor="img">Or enter Image URL directly:</label>
          <input
            type="text"
            id="img"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="Only if not uploading an image file"
          />

          <label htmlFor="price_range">Price Range:</label>
          <select
            name="price_range"
            value={formData.price_range}
            onChange={handleChange}
            required
            className="form-dropdown"
          >
            <option value="">Select a price range</option>
            {priceRange.map((range, index) => {
              // Handle both string type and object type
              const typeValue = typeof range === 'string' ? range : (range.id || range);
              const typeLabel = typeof range === 'string' ? range : (range.name || range);
              
              return (
                <option key={index} value={typeValue}>
                  {typeLabel}
                </option>
              );
            })}
          </select>

          <label htmlFor="location">Address:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="form-dropdown"
          >
            <option value="">Select a property type</option>
            {types.map((type, index) => {
              const typeValue = typeof type === 'string' ? type : (type.id || type);
              const typeLabel = typeof type === 'string' ? type : (type.name || type);
              
              return (
                <option key={index} value={typeValue}>
                  {typeLabel}
                </option>
              );
            })}
          </select>

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

          <button 
            type="submit" 
            className="add-property-btn"
            disabled={uploading}
          >
            {uploading ? 'Uploading Image...' : 'Add Property'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;