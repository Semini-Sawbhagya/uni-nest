import React from 'react';
import './LandlordHome.css'; // Import the CSS file

const LandLordHome = () => {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Welcome back, Landlord!</h1>
        <p>Manage your properties and students from one place.</p>
      </header>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <h2>Total Properties</h2>
          <p>3</p>
        </div>
        <div className="stat-card">
          <h2>Total Students</h2>
          <p>15</p>
        </div>
        <div className="stat-card">
          <h2>Available Spaces</h2>
          <p>5</p>
        </div>
        <div className="stat-card">
          <h2>Active Listings</h2>
          <p>3</p>
        </div>
      </div>

      {/* Actions Section */}
      <div className="actions-grid">
        <div className="action-card">
          <h2>Manage Properties</h2>
          <p>View and manage your boarding places.</p>
          <button className="btn-view-properties">View Properties</button>
        </div>
        <div className="action-card">
          <h2>Add New Property</h2>
          <p>List a new boarding place.</p>
          <button className="btn-add-property">Add Property</button>
        </div>
        <div className="action-card">
          <h2>Manage Students</h2>
          <p>View and manage student assignments.</p>
          <button className="btn-view-students">View Students</button>
        </div>
        <div className="action-card">
          <h2>Subscription Plan</h2>
          <p>View or upgrade your current plan.</p>
          <button className="btn-view-plan">View Plan</button>
        </div>
      </div>
    </div>
  );
};

export default LandLordHome;