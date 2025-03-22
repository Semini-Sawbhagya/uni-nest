import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "./MyBoarding.css";
import Navbar from "../NavBar/NavBar";

const BoardingDetails = () => {
  const { id } = useParams();
  const [boarding, setBoarding] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState({ lat: 6.9271, lng: 79.8612 }); // Default coordinates (Colombo)
  const [ratings, setRatings] = useState({});
  const [review, setReview] = useState([]);

  useEffect(() => {
    const token = Cookies.get("accessToken");

    const fetchBoardingDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/boarding_details/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBoarding(response.data);
        setLoading(false);

        if (response.data.location) {
          fetchCoordinates(response.data.location);
        }
      } catch (err) {
        setError("Failed to load boarding details.");
        setLoading(false);
      }
    };

    const fetchAverageRatings = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/get-average-rating/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRatings(response.data.p_ratings); // Assuming p_ratings contains the rating data
        setLoading(false);
      } catch (err) {
        setError("Failed to load ratings.");
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/get-reviews/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200 && Array.isArray(response.data)) {
          setReview(response.data); // Ensuring it's an array of reviews
        } else {
          setError("No reviews found.");
        }
      } catch (err) {
        setError("Failed to load reviews.");
        setLoading(false);
      }
    };

    const fetchCoordinates = async (location) => {
      try {
        const geoResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        if (geoResponse.data.length > 0) {
          setCoords({
            lat: parseFloat(geoResponse.data[0].lat),
            lng: parseFloat(geoResponse.data[0].lon),
          });
        }
      } catch (err) {
        console.error("Failed to fetch coordinates:", err);
      }
    };

    if (id) {
      fetchBoardingDetails();
      fetchAverageRatings();
      fetchReviews();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!boarding) return <p>No details found.</p>;

  return (
    <div>
      <Navbar />
      <div className="boarding-details">
        <h1>My Boarding Details</h1>
        <img
          src={`http://127.0.0.1:8000/images/${boarding.img}`}
          alt="Boarding Place"
          style={{ width: "300px", height: "200px", objectFit: "cover", borderRadius: "10px" }}
        />
        <p><strong>ID:</strong> {boarding.boarding_id}</p>
        <p><strong>Location:</strong> {boarding.location}</p>
        <p><strong>Latitude:</strong> {coords.lat}</p>
        <p><strong>Longitude:</strong> {coords.lng}</p>
        <p><strong>University ID:</strong> {boarding.uni_id}</p>
        <p><strong>Landlord ID:</strong> {boarding.landlord_id}</p>
        <p><strong>Type:</strong> {boarding.type}</p>
        <p><strong>Price:</strong> {boarding.price}</p>
        <p><strong>Ratings:</strong> {ratings ? ratings.averageRating : 'No ratings available'}</p> {/* Assuming 'averageRating' exists */}
        <div>
          <h2 className="heading">Reviews</h2>
          {review && review.length > 0 ? (
            review.map((item, index) => (
              <div key={index} className="review-item">
                <h4>{item.user_name}</h4>
                <p>{item.review}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        <p><strong>Security:</strong> {boarding.security}</p>
        <p><strong>Available Space:</strong> {boarding.available_space}</p>
        <div>
          <MapContainer
            center={coords}
            zoom={15}
            style={{ width: '100%', height: '400px', borderRadius: '10px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={coords}>
              <Popup>{boarding.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default BoardingDetails;
