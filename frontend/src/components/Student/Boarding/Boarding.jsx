import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "./Boarding.css";

const BoardingDetails = () => {
  const { id } = useParams();
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
        setLoading(false);
      } catch (err) {
        console.error("Error fetching boarding details:", err);
        setError("Failed to load boarding details.");
        setLoading(false);
      }
    };

    if (id) {
      fetchBoardingDetails();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!boarding) return <p>No details found.</p>;

  // Coordinates of the boarding place (valid values should be provided)
  const boardingLocation = {
    lat: 6.9271,
    lng: 79.8612,
  };

  const center = boardingLocation;

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

      <div>
        <MapContainer
          center={center}
          zoom={15}
          style={{ width: '100%', height: '400px', borderRadius: '10px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={boardingLocation}>
            <Popup>{boarding.location}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default BoardingDetails;
