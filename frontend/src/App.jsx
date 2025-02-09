import React from 'react'
import NavBar from './components/Student/NavBar/NavBar'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Student/Home/Home'
import Footer from './components/Footer/Footer'
const App = () => {
  return (
    <>
    <div className='app'>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App
