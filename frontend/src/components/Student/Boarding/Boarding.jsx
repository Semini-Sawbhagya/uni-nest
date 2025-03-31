import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Star} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Navbar from "../NavBar/NavBar";
import { jwtDecode } from "jwt-decode";
import "leaflet/dist/leaflet.css";
import "./Boarding.css";

const BoardingDetails = () => {
  const { id } = useParams();
  const [userId, setUserId] = useState('');
  const [boarding, setBoarding] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState({ lat: 6.9271, lng: 79.8612 }); // Default coordinates (Colombo)
  const [requestStatus, setRequestStatus] = useState('');
  const [ratings, setRatings] = useState('');
  const [review, setReview] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.log('Token not found in cookies.');
    }
    
  }, []);

  useEffect(() => {
    const token = Cookies.get("accessToken");
  
    // Function to fetch boarding details
    const fetchBoardingDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/boarding_details/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
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
        setRatings(response.data.p_ratings);
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
          setReview(response.data);
        } else {
          setError("No reviews found.");
        }
  
        
      } catch (err) {
        setError("Failed to load reviews.");
        setLoading(false);
      }
    };
  
  
  
    // Function to fetch coordinates using location
    const fetchCoordinates = async (location) => {
      try {
        const geoResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        if (geoResponse.data.length > 0) {
          setCoords({
            lat: parseFloat(geoResponse.data[0].lat),
            lng: parseFloat(geoResponse.data[0].lon)
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
  }, [id]);  // Only depends on `id`, since it's needed to fetch boarding details.
  
  useEffect(() => {
    const token = Cookies.get("accessToken");
  
    // Function to fetch request status
    const fetchRequestStatus = async (boardingId) => {
      console.log("User ID:", userId); // Check if userId is valid
      console.log("Boarding ID:", boardingId); // Check if boardingId is valid
      if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
      }
      try {
        const statusResponse = await axios.get(`http://127.0.0.1:8000/get-status/${userId}/${boardingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequestStatus(statusResponse.data.status);
  
       console.log("Status Response:", statusResponse.data);
       console.log("Request Status:", statusResponse.data.status);
       requestStatus(statusResponse.data.status);
      } catch (err) {
        console.log("Already added the request:");
      
         // Default to empty if no status is found
      }
    };
  
    if (boarding && userId) {
      fetchRequestStatus(boarding.boarding_id);
    }
  }, [boarding, userId]); // Depends on `boarding` and `userId` to fetch the status
  
  const handleAddRequest = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    if (!boarding) {
      alert("Boarding details not loaded yet. Please wait.");
      return;
    }
    

    console.log("Payload:", {
      user_id: userId,
      boarding_id: boarding.boarding_id,
      status: requestStatus
    });

    try {
      await axios.post(
        "http://127.0.0.1:8000/add-request/",
        {
          user_id: userId,
          boarding_id: boarding.boarding_id,
          status: "pending"
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      setRequestStatus("pending"); 
      console.log("Payload:", {
        user_id: userId,
        boarding_id: boarding.boarding_id,
        status: requestStatus
      }); 
      alert("Request added successfully with status: pending");
    } catch (err) {
      console.error("Already added the request:");
      alert("Already added the request:");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!boarding) return <p>No details found.</p>;

  return (
    <div>
      <Navbar />
      <div className="boarding-details">
        <h1>Boarding Details</h1>
        <img
                src={boarding.img}
                alt="Boarding Place"
                style={{ width: "300px", height: "200px", objectFit: "cover", borderRadius: "10px" }}
        />
        <p><strong>ID:</strong> {boarding.boarding_id}</p>
        <p><strong>Location:</strong> {boarding.location}</p>
        <p><strong>University ID:</strong> {boarding.uni_id}</p>
        <p><strong>Landlord ID:</strong> {boarding.landlord_id}</p>
        <p><strong>Landlord Contact:</strong> {contact}</p>
        <p><strong>Type:</strong> {boarding.type}</p>
        <p><strong>Price:</strong> {boarding.price}</p>
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

        {/* Dynamic Button for Add Request */}
        <button
          className='AddButton'
          onClick={handleAddRequest}
          disabled={requestStatus === 'pending'}
        >
          
        {requestStatus === 'pending' ? 'Pending' : requestStatus === 'approved' ? 'Approved' : requestStatus === 'rejected' ? 'Rejected' : 'Add Request'}
        </button>
        

      </div>
    </div>
  );
};

export default BoardingDetails;

