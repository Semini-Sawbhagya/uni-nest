import { useState } from "react";
import { Star } from "lucide-react";
import "./ReviewRating.css"; // Import the external CSS file for styles
import Navbar from "../NavBar/NavBar";

const ReviewRating = () => {
  const [reviews, setReviews] = useState([
    { id: 1, name: "Alice", rating: 5, comment: "Great service!" },
    { id: 2, name: "Bob", rating: 4, comment: "Good, but can be improved." },
  ]);
  const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || newReview.rating === 0 || !newReview.comment) return;
    setReviews([...reviews, { id: Date.now(), ...newReview }]);
    setNewReview({ name: "", rating: 0, comment: "" });
  };

  return (
    <div>
      <Navbar />
    <div className="review-container">
      <h2 className="review-heading">Reviews & Ratings</h2>
      <form onSubmit={handleSubmit} className="review-form">
        <input
          type="text"
          placeholder="Your Name"
          className="review-input"
          value={newReview.name}
          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
        />
        <div className="review-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`review-star ${newReview.rating >= star ? "selected" : "deselected"}`}
              onClick={() => setNewReview({ ...newReview, rating: star })}
            />
          ))}
        </div>
        <textarea
          placeholder="Write a review..."
          className="review-textarea"
          rows="3"
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
        ></textarea>
        <button type="submit" className="review-button">Submit</button>
      </form>
    </div>
    </div>
  );
};

export default ReviewRating;
