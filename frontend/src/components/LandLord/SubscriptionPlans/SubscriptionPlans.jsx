import React, { useEffect, useState } from "react";
import "./SubscriptionPlans.css";
import axios from "axios";
import Cookies from 'js-cookie';
import Navbar from "../NavBar/NavBar";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    const fetchPlans = async () => {
      try {
        const response = await axios.get("http://localhost:8000/packages", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPlans(response.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div><Navbar />
    <div className="subscription-container">
      <h1 className="subscription-header">Subscription Plans</h1>
      <p className="subscription-description">
        Choose a plan to list your boardings on our website.
      </p>

      {loading && <p className="loading-message">Loading plans...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="plans-grid">
        {!loading &&
          !error &&
          plans.map((plan, index) => (
            <div key={index} className="plan-card">
              <h2 className="plan-name">{plan.name}</h2>
              <p className="plan-description">
                List up to {plan.no_of_boardings} boardings for {plan.duration} months.
              </p>
              <p className="plan-price">${plan.amount}/{plan.duration} month(s)</p>
              <button className="subscribe-button">Subscribe</button>
            </div>
          ))}
      </div>
    </div>
    </div>
  );
};

export default SubscriptionPlans;