import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBoardings.css";
import { Navigate, useNavigate } from "react-router-dom";


const SearchBoardings = () => {
  const [uniId, setUniId] = useState("");
  const [priceRanges, setPriceRange] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [boardings, setBoardings] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]); 
  const [selectedType, setSelectedType] = useState(""); 
  const navigate = useNavigate();

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
    fetchTypes();
    const fetchPrice_Range = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/price-ranges");
        console.log("Types from API:", response.data);
        setPriceRange(response.data); 
      } catch (err) {
        console.error("Error fetching price-range:", err);
        setError("Failed to load price-range.");
      }
    };
    fetchPrice_Range();

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
    if (!uniId && !selectedType && !selectedPriceRange) {  // Fix: replaced `type` with `selectedType`
      setError("Please select at least one filter.");
      return;
    }
    let url = "http://127.0.0.1:8000/";
  
    if (uniId && selectedType && selectedPriceRange) {  // Fix here too
      url += `boardings-by-uni-price-type/${uniId}/${selectedPriceRange}/${selectedType}`;
    } else if (uniId && selectedType) {
      url += `boardings-by-uni-type/${uniId}/${selectedType}`;
    } else if (uniId && selectedPriceRange) {
      url += `boardings-by-uni-price/${uniId}/${selectedPriceRange}`;
    } else if (uniId) {
      url += `boardings/${uniId}`;
    } else if (selectedType && selectedPriceRange) {
      url += `boardings-by-type-price/${selectedType}/${selectedPriceRange}`;
    } else if (selectedType) {
      url += `boardings-type/${selectedType}`;
    } else if (selectedPriceRange) {
      url += `boardings-price_range/${selectedPriceRange}`;
    }
  
    fetchBoardings(url);
  };
  const handleBoarding = (boardingId) => {
    navigate(`/boarding/${boardingId}`); // Navigate to the specific boarding's page
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
      <select
        className="select-field"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="">Select a Type</option>
        {types.length > 0 ? (
          types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))
        ) : (
          <option disabled>Loading types...</option>
        )}
      </select>

      {error && <p className="error">{error}</p>}
    </div>
        <div>
          <label>Price Range:</label>
          <select
            className="select-field"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
          >
            <option value="">Select a Price Range</option>
            {priceRanges.length > 0 ? (
              priceRanges.map((priceRange) => (
                <option key={priceRange} value={priceRange}>
                  {priceRange}
                </option>
              ))
            ) : (
              <option disabled>Loading price range...</option>
            )}
      </select>

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
            <button key={boarding.boarding_id} onClick={() => handleBoarding(boarding.boarding_id)}>
              <div className="boarding-item">
                <p><strong>ID:</strong> {boarding.boarding_id}</p>
                <p><strong>Type:</strong> {boarding.type || 'N/A'}</p>
                <p><strong>Price Range:</strong> {boarding.price_range || 'N/A'}</p>
                <p><strong>Location:</strong> {boarding.location || 'N/A'}</p>
                <p><strong>Ratings:</strong> {boarding.ratings || 'N/A'}</p>
              </div>
            </button>
          ))
        ) : (
          <p>No boardings found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchBoardings;
