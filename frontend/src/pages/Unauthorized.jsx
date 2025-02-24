import React from "react";
import { useNavigate } from "react-router-dom";
import "./unauthorized.css";  
export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="unauthorized-container">
      <div className="content-wrapper">
        <h1 className="error-code">401</h1>
        <h2 className="error-title">Unauthorized Access</h2>
        <div className="alert-box">
          <strong>Access Denied</strong>
          <p>You don't have permission to access this resource.</p>
        </div>
        <p className="explanation-text">This might be because:</p>
        <ul className="reasons-list">
          <li>Your session has expired</li>
          <li>You need additional permissions</li>
          <li>You're not logged in</li>
        </ul>
        <div className="button-container">
          <button onClick={handleLogin} className="login-button">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}