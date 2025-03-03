import React from 'react'
import './home.css'
import Header from '../Header/Header'
import { useState } from 'react'
import SearchBoardings from '../SearchBoardings/SearchBoardings'
import Navbar from '../NavBar/NavBar'
import Footer from '../../Footer/Footer'

const home = () => {

  
  return (
    <>
    <div>
        <Navbar/>
        <Header/>
        <SearchBoardings/>
        
    </div>
    <Footer/> 
    </>
  )
}

export default home
