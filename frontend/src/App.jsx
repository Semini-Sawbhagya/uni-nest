import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import SignUp from './pages/SignUp/SignUp'
import React from 'react'
import NavBar from './components/Student/NavBar/NavBar'
import Home from './components/Student/Home/Home'
import Footer from './components/Footer/Footer'

function App() {
  

  return (
    <BrowserRouter>
     
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path='/home' element={<Home/>}/>
      
    </Routes>
    
    </BrowserRouter>
    
  )
}

export default App