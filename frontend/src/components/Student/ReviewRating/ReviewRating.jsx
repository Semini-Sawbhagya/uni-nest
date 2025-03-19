import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import "./ReviewRating.css";
import Navbar from "../NavBar/NavBar";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ReviewRating = () => {
  const [userId, setUserId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [ratings, setRatings] = useState(0);
  const [review, setReview] = useState('');
  const [boardingId, setBoardingId] = useState('');

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.user_id);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
    console.log("decoded token:", userId);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchStudentId(userId);
      fetchBoardingId(userId);
    }
  }, [userId]);

  useEffect(() => {
    console.log("Updated boarding ID:", boardingId);  // ✅ Debugging
  }, [boardingId]);

  const fetchStudentId = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/get-student-id/${userId}`);
      setStudentId(response.data.out_student_id);
    } catch (error) {
      console.error("Error fetching student ID:", error);
    }
  };

  const fetchBoardingId = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/get-my-boarding-id/${userId}`);
      console.log("API Response for Boarding ID:", response.data);  // ✅ Debugging
      setBoardingId(response.data.my_boarding_id);
    } catch (error) {
      console.error("Error fetching boarding ID:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!boardingId) {
      alert("Boarding ID is not yet loaded. Please try again.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/student-review/", {
        student_id: studentId,
        boarding_id: boardingId,
        ratings: parseFloat(ratings),
        review: review,
      });
      console.log("Submitting:", { student_id: studentId, boarding_id: boardingId, ratings, review });

      alert(response.data.message);
      setRatings(0);
      setReview("");
    } catch (error) {
      console.error("Review Error:", error);
      alert("Cannot Submit the Review. Please try again later.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="review-container">
        <h2 className="review-heading">Reviews & Ratings</h2>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((star) => (
             <Star
             key={star}
             className={`review-star ${ratings >= star ? "selected" : ""}`}
             onClick={() => setRatings(star)}
             fill={ratings >= star ? "gold" : "none"}
             stroke="gold"
           />
           
            ))}
          </div>
          <textarea
            placeholder="Write a review..."
            className="review-textarea"
            rows="3"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
          <button type="submit" className="review-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewRating;
