import React from "react";
import "./SignUp.css"; // Import the external CSS file
import { Link } from "react-router-dom";
import axios from 'axios'
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const SignUp = () => {
    const [user_name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/student-register',{user_name,email,password})
        .then(result => {console.log(result)
            navigate('/login')
        })
        .catch(err => console.log(err))
        
    }



    return (
      <div className="signup-container">
        <h1 className="main-title">Uni Nest</h1> {/* Main title */}
        <div className="signup-card">
          <h2 className="signup-title">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" id="name" placeholder="Enter Name" className="form-input" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" placeholder="Enter Email" className="form-input" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" id="password" placeholder="Enter Password" className="form-input" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="signup-button">Register</button>
          </form>
          <p className="signup-footer">Already Have an Account? <Link to="/login" className="login-link">Login</Link></p>
        </div>
      </div>
    );
    
};

export default SignUp;
