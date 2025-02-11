import React from 'react'
import './home.css'
import Header from '../../Student/Header/header'
//import ExploreMenu from '../../components/ExploreMenu/exploreMenu'
import { useState } from 'react'
//import FoodDisplay from '../../components/FoodDisplay/foodDisplay'
//import AppDownload from '../../components/AppDownload/AppDownload'
import { useNavigate } from 'react-router-dom'

const home = () => {

  const navigate = useNavigate();

  const handlelogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }
  
  return (
    <div>
        <Header/>
        <button onClick={handlelogout}>Logout</button>
       
    </div>
  )
}

export default home
