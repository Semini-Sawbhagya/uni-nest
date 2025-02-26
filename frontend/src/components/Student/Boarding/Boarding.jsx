import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Boarding.css";

const BoardingDetails = () => {
  const { id } = useParams(); // Get the boarding ID from the URL
  const [boarding, setBoarding] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("accessToken");

    const fetchBoardingDetails = async () => {
      console.log("Fetching from:", `http://127.0.0.1:8000/boarding_details/${id}`);

      try {
        const response = await axios.get(`http://127.0.0.1:8000/boarding_details/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response:", response.data);
        setBoarding(response.data);
        setLoading(false); // ✅ Stop loading after successful fetch
      } catch (err) {
        console.error("Error fetching boarding details:", err);
        setError("Failed to load boarding details."); // ✅ Set error message
        setLoading(false); // ✅ Stop loading even if there's an error
      }
    };

    if (id) {
      fetchBoardingDetails();
    }
  }, [id]);

  // ✅ Improved UI handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!boarding) return <p>No details found.</p>;

  return (
    <div className="boarding-details">
      <h1>Boarding Details</h1>
      <img
        src={`http://127.0.0.1:8000/images/${boarding.img}`} 
        alt="Boarding Place"
        style={{ width: "300px", height: "200px", objectFit: "cover", borderRadius: "10px" }}
      />
      <p><strong>ID:</strong> {boarding.boarding_id}</p>
      <p><strong>University ID:</strong> {boarding.uni_id}</p>
      <p><strong>Landlord ID:</strong> {boarding.landlord_id}</p>
      <p><strong>Type:</strong> {boarding.type}</p>
      <p><strong>Price Range:</strong> {boarding.price_range}</p>
      <p><strong>Location:</strong> {boarding.location}</p>
      <p><strong>Ratings:</strong> {boarding.ratings}</p>
      <p><strong>Review:</strong> {boarding.review}</p>
      <p><strong>Security:</strong> {boarding.security}</p>
      <p><strong>Available Space:</strong> {boarding.available_space}</p>
    </div>
  );
};

export default BoardingDetails;
