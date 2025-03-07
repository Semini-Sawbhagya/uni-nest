import React from "react";
import Navbar from "../NavBar/NavBar";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <div className="about-us-container">
        <div className="about-us-header">
          <h2>About Us</h2>
          <p>
            Welcome to our boarding place finder app, designed specifically
            for government university students in Sri Lanka. Our goal is to
            simplify the process of finding affordable, safe, and convenient
            boarding options.
          </p>
        </div>

        <div className="about-us-card">
          <h3>What We Offer</h3>
          <ul>
            <li>
              Search for boarding places based on university, price range, and
              type (Room, House, Apartment).
            </li>
            <li>View detailed boarding information, including:</li>
            <ul>
              <li>Location (e.g., Moratuwa, Molpe Rd)</li>
              <li>University ID</li>
              <li>Type, Price Range, Ratings, and Reviews</li>
              <li>Security Details and Available Spaces</li>
            </ul>
            <li>Interactive maps to locate boarding places easily.</li>
            <li>Secure payment options for booking boarding places.</li>
            <li>Rate and review your boarding experience.</li>
          </ul>
        </div>

        {/* New Section: Our Mission */}
        <div className="about-us-card">
          <h3>Our Mission</h3>
          <p>
            Our mission is to provide government university students with
            reliable, safe, and affordable boarding options. We aim to
            streamline the search process by offering a platform that brings
            together trusted boarding places in various regions.
          </p>
          <p>
            We are committed to making the search for student accommodations as
            stress-free as possible, helping students focus on their studies and
            well-being.
          </p>
        </div>

        {/* New Section: Our Team */}
        <div className="about-us-card">
          <h3>Our Team</h3>
          <p>
            Our team is composed of passionate individuals who understand the
            challenges that university students face when finding suitable
            boarding places. Together, we are dedicated to creating a seamless
            and efficient platform for students in Sri Lanka.
          </p>
          <ul>
            <li><strong>D.M.Nipun Sachintha Gunarathna</strong> - Founder & CEO</li>
            <li><strong>W.B.Semini Sawbhagya Harinakshi</strong> - Product Manager</li>
          </ul>
        </div>

        {/* New Section: Contact Us */}
        <div className="about-us-card">
          <h3>Contact Us</h3>
          <p>
            If you have any questions or need assistance, feel free to get in
            touch with us! We are here to help.
          </p>
          <ul>
            <li><strong>Email:</strong> uninest.lk</li>
            <li><strong>Phone:</strong> +94 123 456 789</li>
            <li><strong>Address:</strong> No. 123, Colombo, Sri Lanka</li>
          </ul>
          
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
