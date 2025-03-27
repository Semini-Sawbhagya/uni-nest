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
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/universities");
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
        setPriceRange(response.data); 
      } catch (err) {
        console.error("Error fetching price-range:", err);
        setError("Failed to load price-range.");
      }
    };
    fetchPrice_Range();
  }, []);

  const fetchAverageRatings = async (boardingId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-average-rating/${boardingId}`);
      return response.data.p_ratings;
    } catch (err) {
      console.error(`Failed to load ratings for ${boardingId}:`, err);
      return "N/A"; 
    }
  };

  const fetchBoardings = async (endpoint) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(endpoint);
      if (response.status === 200) {
        const fetchedBoardings = response.data;

        const ratingsData = {};
        await Promise.all(
          fetchedBoardings.map(async (boarding) => {
            const rating = await fetchAverageRatings(boarding.boarding_id);
            ratingsData[boarding.boarding_id] = rating;
          })
        );

        setBoardings(fetchedBoardings);
        setRatings(ratingsData);
      } else {
        setError("Unexpected response status: " + response.status);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.error || "No boardings for the given criteria");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!uniId && !selectedType && !selectedPriceRange) {
        setError("Please select at least one filter.");
        return;
    }

    let url = "http://127.0.0.1:8000/";

    const encodedPriceRange = encodeURIComponent(selectedPriceRange);

    if (uniId && selectedType && selectedPriceRange) {
        url += `boardings-by-uni-price-type/${uniId}/${encodedPriceRange}/${selectedType}`;
    } else if (uniId && selectedType) {
        url += `boardings-by-uni-type/${uniId}/${selectedType}`;
    } else if (uniId && selectedPriceRange) {
        url += `boardings-by-uni-price/${uniId}/${encodedPriceRange}`;
    } else if (uniId) {
        url += `boardings/${uniId}`;
    } else if (selectedType && selectedPriceRange) {
        url += `boardings-by-type-price/${selectedType}/${encodedPriceRange}`;
    } else if (selectedType) {
        url += `boardings-type/${selectedType}`;
    } else if (selectedPriceRange) {
        url += `boardings-price_range/${encodedPriceRange}`;
    }

    fetchBoardings(url);
};

  const handleBoarding = (boardingId) => {
    navigate(`/boarding/${boardingId}`);
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
                {university.name}
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
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Price Range:</label>
          <select
            className="select-field"
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
          >
            <option value="">Select a Price Range</option>
            {priceRanges.map((priceRange) => (
              <option key={priceRange} value={priceRange}>{priceRange}</option>
            ))}
          </select>
        </div>
      </div>
      <button onClick={handleSearch} className="button">Search</button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="boarding-list">
        {boardings.map((boarding) => (
          <button key={boarding.boarding_id} onClick={() => handleBoarding(boarding.boarding_id)}>
            <div className="boarding-item">
              <img
                src={boarding.img}
                alt="Boarding Place"
                style={{ width: "300px", height: "200px", objectFit: "cover", borderRadius: "10px" }}
              />
              <p><strong>ID:</strong> {boarding.boarding_id}</p>
              <p><strong>Type:</strong> {boarding.type || 'N/A'}</p>
              <p><strong>Price:</strong> {boarding.price || 'N/A'}</p>
              <p><strong>Location:</strong> {boarding.location || 'N/A'}</p>
              <p><strong>Ratings:</strong> {ratings[boarding.boarding_id] || '0'}</p>
              <p><strong>Security:</strong> {boarding.security || 'N/A'}</p>
              
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBoardings;
