import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBoardings.css";

const SearchBoardings = () => {
  const [uniId, setUniId] = useState("");
  const [type, setType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [boardings, setBoardings] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    fetchUniversities();
  }, []);

  const fetchBoardings = async (endpoint) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(endpoint);
      console.log("Response data:", response.data);
      if (response.status === 200) {
        setBoardings(response.data);
      } else {
        setError("Unexpected response status: " + response.status);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.error || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!uniId && !type && !priceRange) {
      setError("Please select at least one filter.");
      return;
    }
    let url = "http://127.0.0.1:8000/";

    if (uniId && type && priceRange) {
      url += `boardings-by-uni-price-type/${uniId}/${priceRange}/${type}`;
    } else if (uniId && type) {
      url += `boardings-by-uni-type/${uniId}/${type}`;
    } else if (uniId && priceRange) {
      url += `boardings-by-uni-price/${uniId}/${priceRange}`;
    } else if (uniId) {
      url += `boardings/${uniId}`;
    } else if (type && priceRange) {
      url += `boardings-by-type-price/${type}/${priceRange}`;
    } else if (type) {
      url += `boardings-type/${type}`;
    } else if (priceRange) {
      url += `boardings-price_range/${priceRange}`;
    }

    fetchBoardings(url);
  };

  return (
    <div className="container">
      <h1 className="heading">Search Boarding Places</h1>
      <div className="input-container">
        <div>
          <label>University:</label>
          <select className="select-field" value={uniId} onChange={(e) => setUniId(e.target.value)}>
            <option value="">Select a University</option>
            {universities.map((university) => (
              <option key={university.uni_id} value={university.uni_id}>
                {university.name} {/* Corrected from "uni_name" to "name" */}
              </option>
            ))}
          </select>


        </div>
        <div>
          <label>Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-field"
            placeholder="e.g., Apartment"
          />
        </div>
        <div>
          <label>Price Range:</label>
          <input
            type="text"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="input-field"
            placeholder="e.g., 5000-10000"
          />
        </div>
      </div>
      <button onClick={handleSearch} className="button">
        Search
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="boarding-list">
        {Array.isArray(boardings) && boardings.length > 0 ? (
          boardings.map((boarding) => (
            <div key={boarding.boarding_id} className="boarding-item">
              <p><strong>ID:</strong> {boarding.boarding_id}</p>
              <p><strong>Type:</strong> {boarding.type || 'N/A'}</p>
              <p><strong>Price Range:</strong> {boarding.price_range || 'N/A'}</p>
              <p><strong>Location:</strong> {boarding.location || 'N/A'}</p>
              <p><strong>Ratings:</strong> {boarding.ratings || 'N/A'}</p>
            </div>
          ))
        ) : (
          <p>No boardings found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchBoardings;
