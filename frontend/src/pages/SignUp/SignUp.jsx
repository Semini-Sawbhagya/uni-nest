import React, { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const [user_name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("student");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create payload matching the backend model exactly
        const payload = {
            user_name: user_name,
            email: email,
            password: password,
            userType: userType
        };
    
        axios.post('http://localhost:8000/register', payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(result => {
            console.log(result);
            navigate('/login');
        })
        .catch(err => {
            console.error('Registration error:', err.response?.data);
            // Handle error appropriately (e.g., show to user)
        });
    };

    return (
        <div className="signup-page">
        <div className="signup-container">
            <h1 className="main-title">Uni Nest</h1> {/* Main title */}
            <div className="signup-card">
                <h2 className="signup-title">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Enter Name" 
                            className="form-input" 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Enter Email" 
                            className="form-input" 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Enter Password" 
                            className="form-input" 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">I am a</label>
                        <div className="user-type-options">
                            {["student", "landlord"].map((type) => (
                                <button 
                                    key={type} 
                                    type="button" 
                                    className={`user-type-button ${userType === type ? "selected" : ""}`} 
                                    onClick={() => setUserType(type)}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="signup-button">Register</button>
                </form>
                <p className="signup-footer">Already Have an Account? <Link to="/login" className="login-link">Login</Link></p>
            </div>
        </div>
        </div>
    );
};

export default SignUp;
