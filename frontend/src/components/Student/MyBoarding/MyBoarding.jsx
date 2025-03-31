import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "./MyBoarding.css";
import { Star } from "lucide-react";

import Navbar from "../NavBar/NavBar";

const BoardingDetails = () => {
  const { id } = useParams();
  const [boarding, setBoarding] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState({ lat: 6.9271, lng: 79.8612 }); // Default coordinates (Colombo)
  const [ratings, setRatings] = useState('');
  const [review, setReview] = useState([]);
  const [contact, setContact] = useState('');
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
    const fetchLandLordContacts = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/get-landlord-contact/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContact(response.data.contact);
        setLoading(false);
        console.log("Landlord Contact:", response.data.contact);
       
      } catch (err) {
        setError("Failed to load contacts.");
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
      fetchLandLordContacts();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!boarding) return <p>No details found.</p>;

  return (
    <div>
      <Navbar />
      <div className="boarding-details">
        <h1 className="my-boarding-h1">My Boarding Details</h1>
        <img
          src={boarding.img}
          alt="Boarding Place"
          style={{ width: "300px", height: "200px", objectFit: "cover", borderRadius: "10px" }}
        />
        <p><strong>ID:</strong> {boarding.boarding_id}</p>
        <p><strong>Location:</strong> {boarding.location}</p>
        <p><strong>University ID:</strong> {boarding.uni_id}</p>
        <p><strong>Type:</strong> {boarding.type}</p>
        <p><strong>Price:</strong> {boarding.price}</p>
        <p><strong>Landlord Contact:</strong> {contact}</p>
        <svg width="0" height="0">
          <linearGradient id="halfGradient">
            <stop offset="50%" stopColor="gold" />
            <stop offset="50%" stopColor="none" />
          </linearGradient>
        </svg>

        <p><strong>Ratings:</strong> {ratings[boarding.boarding_id] ? Number(ratings[boarding.boarding_id]).toFixed(1) : "No ratings yet"}
          <span className="small-stars">
            {[1, 2, 3, 4, 5].map((star) => {
              const ratingValue = Number(ratings[boarding.boarding_id]) || 0; // Convert to number
              const fullStar = ratingValue >= star;
              const halfStar = ratingValue >= star - 0.5 && ratingValue < star;

              return (
                <Star
                  key={star}
                  className="small-star"
                  fill={fullStar ? "gold" : halfStar ? "url(#halfGradient)" : "none"}
                  stroke="gold"
                  size={16} 
                />
              );
            })}
          </span>
        </p>

        <p><strong>Security:</strong> {boarding.security}</p>
        <p><strong>Available Space:</strong> {boarding.available_space}</p>
        <div>
          <h2 className="my-boarding-h2">Reviews</h2>
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
