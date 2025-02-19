import React from 'react'
import './home.css'
import Header from '../../Student/Header/header'
import { useState } from 'react'
import SearchBoardings from '../SearchBoardings/SearchBoardings'
import Navbar from '../NavBar/NavBar'
import Footer from '../../Footer/Footer'
import Payment from '../Payment/Payment'

const home = () => {

  
  return (
    <>
    <div>
        <Navbar/>
        <Header/>
        <SearchBoardings/>
        <Payment/>
    </div>
    <Footer/> 
    </>
  )
}

export default home
