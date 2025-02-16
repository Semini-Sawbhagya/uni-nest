import React from "react";
import "../SignUp/SignUp.css";
import axios from 'axios'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'



const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/login',{email,password},{withCredentials:true})
        .then(result => {
          console.log(result.data)
          if(result.data.message === "Login Success"){
            localStorage.setItem('token',result.data.access_token)
            Cookies.set('user_id', result.data.user_id, { secure: true, sameSite: 'Strict' });
            Cookies.set('user_name', result.data.user_name, { secure: true, sameSite: 'Strict' });
            Cookies.set('accessToken', result.data.access_token, { secure: true, sameSite: 'Strict' });
            Cookies.set('role', result.data.role, { secure: true, sameSite: 'Strict' });
          }

          if(result.data.role === "student"){
            navigate('/home')
          }else if(result.data.role === "landlord"){
            navigate('/landlord-home')
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
