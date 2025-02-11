import React from "react";
import "../SignUp/SignUp.css";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/login',{email,password})
        .then(result => {
          console.log(result)
          if(result.data.message === "Login Success"){
            localStorage.setItem('token',result.data.token)
            navigate('/home')
          }
        })
        .catch(err => console.log(err))
        
    }



  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              className="form-input"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              className="form-input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="signup-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
