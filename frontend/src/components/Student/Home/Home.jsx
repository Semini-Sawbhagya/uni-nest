import React, { useEffect } from 'react'
import './home.css'
import Header from '../../Student/Header/header'
//import ExploreMenu from '../../components/ExploreMenu/exploreMenu'
import { useState } from 'react'
//import FoodDisplay from '../../components/FoodDisplay/foodDisplay'
//import AppDownload from '../../components/AppDownload/AppDownload'
import { useNavigate } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'
import axios from 'axios'


const home = () => {

  const navigate = useNavigate();
  const [messages, setMessages] = useState("");

  const handlelogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  

  return (
    <div>
        <NavBar/>
        <Header/>
        <button onClick={handlelogout}>Logout</button>

       
    </div>
  )
}

export default home
